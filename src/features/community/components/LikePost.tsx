import { RiHeart3Fill, RiHeart3Line } from "react-icons/ri";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import user from "../../../lib/api/user";
import styled from "styled-components";
import { useState } from "react";

interface LikeType {
  isLike: boolean | undefined;
  id: number | undefined;
  count: number | undefined;
}

const LikePost = ({ isLike, id, count }: LikeType) => {
  const [like, setLike] = useState<Partial<LikeType>>({
    isLike: isLike,
    count: count,
  });

  const { mutate: likeMutate, data: likedata } = useMutation({
    mutationFn: async () => {
      const data = await user.post(`/boards/likes/${id}`);
      return data.data;
    },
    onMutate: () => {
      if (like.isLike)
        return setLike({ ...like, isLike: false, count: Number(like.count) - 1 });
      else {
        return setLike({ ...like, isLike: true, count: Number(like.count) + 1 });
      }
    },
    onSuccess: (likedata) =>
      setLike({
        ...like,
        isLike: likedata?.data.hasLike,
        count: likedata?.data.likesCount,
      }),
    onError: (error) => console.log(error),
  });
  // console.log("like", like);
  console.log("count", typeof count);

  return (
    <>
      {like.isLike ? (
        <LikeTrue onClick={() => likeMutate()}>
          <RiHeart3Fill />
        </LikeTrue>
      ) : (
        <LikeFalse onClick={() => likeMutate()}>
          <RiHeart3Line />
        </LikeFalse>
      )}
      <LikeCount>{like.count}명이 좋아합니다</LikeCount>
    </>
  );
};

const LikeTrue = styled.div`
  color: red;
  font-size: 30px;
  display: contents;
  cursor: pointer;
`;

const LikeFalse = styled.div`
  color: gray;
  font-size: 30px;
  display: contents;
  cursor: pointer;
`;

const LikeCount = styled.div`
  //
`;
export default LikePost;
