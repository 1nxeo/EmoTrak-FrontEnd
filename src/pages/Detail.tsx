import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import { keys } from "../data/queryKeys/keys";
import user from "../lib/api/user";
import { useNavigate, useParams } from "react-router-dom";
import EmotionIcons from "../components/Icon/EmoticonIcons";
import Flex from "../components/Flex";
import { StCanvasWrapper } from "../features/post/components/Canvas";
import { getCookie, removeCookie } from "../utils/cookies";
import {
  DETAIL_PAGE,
  DRAW_EDIT_PAGE,
  IMAGE_EDIT_PAGE,
  LOGIN_PAGE,
} from "../data/routes/urls";
import { useDelete } from "../features/detail/hooks/useDelete";
// import Star from "../components/Icon/Star";
import styled from "styled-components";

export type DetailType = {
  id: number;
  day: number;
  emoId: number;
  star: number;
  detail: string;
  imgUrl: string | null;
  restrict: boolean;
  share: boolean;
  draw: boolean;
};

const Detail = (): JSX.Element => {
  const params = useParams();
  const dailyId: number = Number(params.id);
  const navigate = useNavigate();
  const token = getCookie("token");
  useEffect(() => {
    if (!token || token === "undefined") {
      if (token) {
        removeCookie("token");
        alert("로그인이 필요합니다 !");
        navigate(`${LOGIN_PAGE}`);
      }
    }
    getDetail();
  }, [token]);

  const { deletePost } = useDelete();

  const getDetail = useCallback(() => {
    return user.get(`daily/${dailyId}`);
  }, [dailyId]);

  const { data, isLoading, isError } = useQuery(
    [`${keys.GET_DETAIL}`],
    getDetail,
    {
      retry: 0,
    }
  );

  const contents = data?.data.data.contents;
  const otherItem = contents?.filter(
    (item: DetailType) => item.id !== dailyId
  )[0];
  const targetItem = contents?.filter(
    (item: DetailType) => item.id === dailyId
  )[0];

  // const viewOtherItemHandler = () => {
  //   setItems((pre) => !pre);
  // };

  const deletePostHandler = (id: number) => {
    if (window.confirm("삭제하시겠습니까?")) {
      deletePost.mutate(id);
    }
  };

  const navigateEditHandler = () => {
    if (targetItem?.draw) {
      navigate(`${DRAW_EDIT_PAGE}/${targetItem?.id}`);
    }
    if (!targetItem?.draw) {
      navigate(`${IMAGE_EDIT_PAGE}/${targetItem?.id}`);
    }
  };

  if (isError) {
    alert("권한이 없습니다!");
    navigate("/");
  }
  if (isLoading) {
    return <div>로딩중..</div>;
  }

  return (
    <div>
      <Flex row>
        <StCanvasWrapper>
          {targetItem?.imgUrl ? (
            <StDetailImageBox>
              <StDetailImage src={targetItem?.imgUrl} alt="" />
            </StDetailImageBox>
          ) : (
            <StDetailImageBox>
              <StDefaultImage>이미지가 필요합니다</StDefaultImage>
            </StDetailImageBox>
          )}
        </StCanvasWrapper>
        <StCanvasWrapper>
          <Flex>
            <div>
              {contents?.length < 2 || dailyId <= otherItem?.id ? (
                <button disabled>previous</button>
              ) : (
                <button
                  onClick={() => navigate(`${DETAIL_PAGE}/${otherItem.id}`)}
                >
                  previous
                </button>
              )}
              {contents?.length < 2 || dailyId >= otherItem?.id ? (
                <button disabled>next</button>
              ) : (
                <button
                  onClick={() => navigate(`${DETAIL_PAGE}/${otherItem.id}`)}
                >
                  next
                </button>
              )}
            </div>
            <Flex row>
              이모티콘
              <EmotionIcons
                height="50"
                width="50"
                emotionTypes={`EMOTION_${targetItem?.emoId}`}
              />
            </Flex>
            <Flex row>
              내 감정점수
              {targetItem?.star}
            </Flex>
            <Flex row>{targetItem?.detail}</Flex>
            <div>
              <button onClick={navigateEditHandler}>수정</button>
              <button onClick={() => deletePostHandler(targetItem?.id)}>
                삭제
              </button>
            </div>
          </Flex>
        </StCanvasWrapper>
      </Flex>
    </div>
  );
};

export default Detail;

const StDefaultImage = styled.div`
  width: 500px;
  height: 500px;
  border: 1px solid;
`;

const StDetailImage = styled.img`
  width: 100%;
  height: 100%;
`;

const StDetailImageBox = styled.div`
  width: 50vw;
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
