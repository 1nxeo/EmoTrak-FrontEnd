/**
 * 백엔드 서버 없이 프론트 기능을 확인하기 위한 목(mock) 설정.
 *
 * - 모든 API 호출이 거치는 axios 인스턴스(src/lib/api/user.ts)를 가로채서
 *   더미 데이터를 반환합니다.
 * - 인증은 쿠키 기반(token / refreshToken)이라, 가짜 로그인 쿠키를 심어
 *   "로그인된 상태"를 그대로 재현합니다. (로그인/인증 코드 수정 불필요)
 *
 * 실제 서버가 복구되면 .env 의 REACT_APP_USE_MOCK 를 끄기만 하면 됩니다.
 */
import MockAdapter from "axios-mock-adapter";
import user from "../lib/api/user";
import { setCookie } from "../utils/cookies";
import * as M from "./mockData";

// 응답 공통 래퍼: 대부분의 훅이 response.data.data 로 페이로드를 읽습니다.
const ok = (payload: unknown): [number, object] => [
  200,
  { data: payload, statusCode: 200 },
];

// URL 에서 마지막 숫자 id 를 추출 (예: "/boards/1000" -> 1000, "daily/12" -> 12)
const idFrom = (url?: string) => Number((url || "").match(/(\d+)(?!.*\d)/)?.[1] ?? 0);

/** 가짜 로그인 상태를 만든다. 관리자 페이지를 보려면 auth 를 "ADMIN" 으로 변경. */
const setFakeAuth = (auth: "USER" | "ADMIN" = "USER") => {
  const header = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"; // {alg,typ}
  const payload = btoa(JSON.stringify({ auth }));
  const token = `${header}.${payload}.mock-signature`;

  setCookie("token", token, { path: "/", maxAge: 604800 });
  setCookie("refreshToken", "mock-refresh-token", { path: "/", maxAge: 604800 });
  setCookie("expire", "9999999999999", { path: "/", maxAge: 604800 });
};

export const setupMock = () => {
  setFakeAuth("USER"); // 관리자 화면 확인 시 "ADMIN" 으로 변경

  const mock = new MockAdapter(user, { delayResponse: 300 });

  // ---- 조회(GET) ----
  // 커뮤니티 상세 (숫자 id) — 목록보다 먼저 등록
  mock.onGet(/\/boards\/\d+$/).reply((config) => ok(M.makeBoardDetail(idFrom(config.url))));
  // 커뮤니티 목록 (?page=...)
  mock.onGet(/\/boards(\?|$)/).reply((config) => {
    const page = Number(config.params?.page ?? new URLSearchParams((config.url || "").split("?")[1]).get("page") ?? 1);
    return ok(M.makeBoards(page));
  });

  // 일기 상세 (daily/:id) — 월간 조회보다 먼저
  mock.onGet(/\/?daily\/\d+$/).reply((config) => ok(M.makeDetail(idFrom(config.url))));
  // 일기 월간 조회
  mock.onGet(/\/daily$/).reply((config) => {
    const year = Number(config.params?.year) || 2026;
    const month = Number(config.params?.month) || 7;
    return ok(M.makeDiary(year, month));
  });

  // 차트
  mock.onGet(/\/graph/).reply(() => ok(M.makeGraph()));
  // 마이페이지
  mock.onGet(/\/users\/mypage/).reply(() => ok(M.makeMypage()));
  // 관리자
  mock.onGet(/\/admin\/boards/).reply(() => ok(M.makeAdminBoards()));
  mock.onGet(/\/admin\/comments/).reply(() => ok(M.makeAdminComments()));

  // ---- 로그인 (헤더로 토큰 전달) ----
  mock.onPost(/\/users\/login/).reply((): [number, object, Record<string, string>] => [
    200,
    { data: {}, statusCode: 200 },
    {
      authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + btoa(JSON.stringify({ auth: "USER" })) + ".mock-signature",
      "refresh-token": "mock-refresh-token",
      "access-token-expire-time": "9999999999999",
    },
  ]);

  // 이메일/닉네임 중복확인 등은 성공 처리
  mock.onPost(/\/users\/(mail-confirm|nick-check|signup)/).reply(() => ok({ result: true }));

  // ---- 그 외 모든 생성/수정/삭제는 성공 처리 (네트워크로 새지 않게) ----
  mock.onAny().reply(() => ok({}));

  // eslint-disable-next-line no-console
  console.info("%c[MOCK] 목데이터 모드로 실행 중입니다 (백엔드 미연결)", "color:#7c3aed;font-weight:bold");
};
