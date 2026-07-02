/**
 * 목(mock) 데이터 생성기.
 * 백엔드 서버 없이 기능을 확인하기 위한 더미 데이터입니다.
 * REACT_APP_USE_MOCK 플래그가 켜져 있을 때만 사용됩니다.
 */

// 감정 종류: 1 Fun / 2 Smile / 3 Calm / 4 Sad / 5 Angry / 6 Cry
const EMO_DETAILS: { [key: number]: string } = {
  1: "오늘은 정말 신나는 하루였다! 친구들과 신나게 놀았다.",
  2: "잔잔하게 미소 지을 만한 소소한 행복이 있었다.",
  3: "차분하고 평온한 하루. 오랜만에 여유를 즐겼다.",
  4: "조금 울적한 기분. 비도 오고 마음이 가라앉았다.",
  5: "화가 나는 일이 있었다. 마음을 다스려보자.",
  6: "눈물이 났던 하루. 그래도 내일은 괜찮아질 거야.",
};

// 무료 플레이스홀더 이미지 (인터넷 연결 시 로드됨)
const img = (seed: number) => `https://picsum.photos/seed/emotrak${seed}/400/400`;

const NICKNAMES = ["감자도리", "행복한하마", "구름조각", "밤하늘", "따뜻한커피", "민트초코"];

/** 달력(월간) 조회용 데이터: GET /daily?year&month */
export const makeDiary = (year: number, month: number) => {
  // 해당 달에 흩뿌려진 몇 개의 기록
  const days = [1, 3, 4, 9, 14, 15, 20, 27];
  const contents = days.map((day, i) => {
    const emoId = (i % 6) + 1;
    return {
      id: month * 100 + day, // 달/일 기반 고정 id
      day,
      emoId,
      star: (i % 5) + 1,
      detail: EMO_DETAILS[emoId],
      restrict: false,
      share: i % 2 === 0,
      draw: i % 3 === 0,
      imgUrl: i % 3 === 0 ? "" : img(i + 1),
      nickname: NICKNAMES[i % NICKNAMES.length],
    };
  });
  return { year, month, contents };
};

/** 상세 조회용 데이터: GET /daily/:id */
export const makeDetail = (dailyId: number) => {
  const emoId = (dailyId % 6) + 1;
  const target = {
    id: dailyId,
    imgUrl: dailyId % 3 === 0 ? "" : img(dailyId),
    emoId,
    nickname: NICKNAMES[dailyId % NICKNAMES.length],
    day: (dailyId % 28) + 1,
    star: (dailyId % 5) + 1,
    detail: EMO_DETAILS[emoId],
    restrict: false,
    share: true,
    draw: dailyId % 3 === 0,
  };
  // 이전/다음 이동 버튼 확인용으로 형제 항목 하나 추가
  const sibling = {
    ...target,
    id: dailyId + 1,
    emoId: (emoId % 6) + 1,
    detail: EMO_DETAILS[(emoId % 6) + 1],
    imgUrl: img(dailyId + 1),
    draw: false,
  };
  return {
    year: 2026,
    month: 7,
    contents: [target, sibling],
  };
};

/** 차트용 데이터: GET /graph?year — body.data 로 배열 반환 */
export const makeGraph = () => {
  const data = Array.from({ length: 12 }, (_, m) => {
    const month = m + 1;
    // 6개 감정에 대한 count/percentage
    const counts = [5, 8, 3, 4, 2, 1].map((c) => ((c + month) % 10) + 1);
    const total = counts.reduce((a, b) => a + b, 0);
    const graph = counts.map((count, i) => ({
      id: i + 1,
      count,
      percentage: Math.round((count / total) * 100),
    }));
    return { month, graph };
  });
  return data;
};

/** 커뮤니티 목록: GET /boards?page — page 1만 데이터, 이후 빈 배열(무한스크롤 종료) */
export const makeBoards = (page: number) => {
  if (page > 1) {
    return { contents: [] };
  }
  const contents = Array.from({ length: 12 }, (_, i) => ({
    id: 1000 + i,
    imgUrl: img(100 + i),
    emoId: (i % 6) + 1,
    nickname: NICKNAMES[i % NICKNAMES.length],
  }));
  return { contents };
};

const nowDateString = () => {
  // "YYYY-MM-DD HH:mm:ss" 형식 (PostDate 컴포넌트가 파싱)
  return "2026-06-30 12:00:00";
};

/** 커뮤니티 상세: GET /boards/:id */
export const makeBoardDetail = (id: number) => {
  const emoId = (id % 6) + 1;
  const comments = Array.from({ length: 3 }, (_, i) => ({
    id: id * 10 + i,
    comment: ["정말 공감돼요!", "힘내세요 :)", "좋은 하루 보내세요~"][i],
    likesCnt: (i + 1) * 2,
    createdAt: nowDateString(),
    email: `user${i}@emotrak.com`,
    nickname: NICKNAMES[i % NICKNAMES.length],
    hasAuth: i === 0, // 첫 댓글은 내 것(수정/삭제 버튼 확인)
    hasLike: i % 2 === 0,
    hasReport: false,
  }));

  return {
    id,
    imgUrl: img(id),
    emoId,
    star: (id % 5) + 1,
    nickname: NICKNAMES[id % NICKNAMES.length],
    detail: EMO_DETAILS[emoId],
    date: nowDateString(),
    hasLike: false,
    hasReport: false,
    hasAuth: false,
    likesCnt: 12,
    comments,
    totalComments: comments.length,
  };
};

/** 마이페이지: GET /users/mypage */
export const makeMypage = () => ({
  email: "isyang@emotrak.com",
  nickname: "감자도리",
  hasSocial: false,
});

/** 관리자 - 신고 게시물: GET /admin/boards */
export const makeAdminBoards = () => {
  const contents = Array.from({ length: 5 }, (_, i) => ({
    id: 1000 + i,
    reportId: 5000 + i,
    nickname: NICKNAMES[i % NICKNAMES.length],
    email: `user${i}@emotrak.com`,
    count: i + 1,
    reason: ["욕설/비방", "음란성", "스팸/광고", "혐오 발언", "기타"][i],
  }));
  return { contents, totalCount: contents.length };
};

/** 관리자 - 신고 댓글: GET /admin/comments */
export const makeAdminComments = () => {
  const contents = Array.from({ length: 5 }, (_, i) => ({
    id: 2000 + i,
    reportId: 6000 + i,
    nickname: NICKNAMES[i % NICKNAMES.length],
    email: `user${i}@emotrak.com`,
    count: i + 1,
    reason: ["욕설/비방", "음란성", "스팸/광고", "혐오 발언", "기타"][i],
  }));
  return { contents, totalCount: contents.length };
};
