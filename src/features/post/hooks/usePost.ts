import { useState } from "react";
import { InputValue } from "../../../pages/DrawingPost";
import { useMutation } from "@tanstack/react-query";
import user from "../../../lib/api/user";
import { useNavigate } from "react-router-dom";

type PostInput = {
  inputValue?: InputValue;
  canvasRef?: React.RefObject<HTMLCanvasElement> | null;
};

export const usePost = ({ inputValue, canvasRef }: PostInput) => {
  const navigate = useNavigate();
  const [picture, setPicture] = useState<Blob | null>(null);
  const [photo, setPhoto] = useState<Blob | null>(null);

  const savePictureHandler = () => {
    const canvas = canvasRef?.current;
    canvas?.toBlob(
      (blob) => {
        if (blob) {
          setPicture(blob);
        }
      },
      "image/png",
      0.95
    );
  };

  // 이미지 파일 업로드 함수
  const fileInputHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const target = event.currentTarget;
    const files = (target.files as FileList)[0];
    const imgBlob = new Blob([files], { type: "image/jpeg" });
    setPhoto(imgBlob);
  };

  const postDiary = useMutation(
    async (item: FormData) => {
      const data = await user.post("/daily", item);
      return data;
    },
    {
      onSuccess(data) {
        navigate("/");
      },
      onError(err) {
        alert("입력한 내용을 확인해주세요!");
      },
    }
  );

  const submitDiaryHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    const dto = new Blob([JSON.stringify(inputValue)], {
      type: "application/json",
    });
    if (picture) {
      formData.append("image", picture);
      formData.append("contents", dto);
      console.log("formData/image", formData.get("image"));
      console.log("formData/contents", formData.get("contents"));

      postDiary.mutate(formData);
    }

    if (photo) {
      formData.append("image", photo);
      formData.append("contents", dto);
      console.log("formData/image", formData.get("image"));
      console.log("formData/contents", formData.get("contents"));

      postDiary.mutate(formData);
    }
  };

  return {
    submitDiaryHandler,
    savePictureHandler,
    fileInputHandler,
    photo,
  };
};