import { useState } from "react";
import { InputValue } from "../../../pages/DrawingPost";

type InputProps = {
  initialValue: InputValue;
  //   id?: number | null;
};

export const useInput = (initialValue: InputValue) => {
  const [inputValue, setInputValue] = useState<InputValue>(initialValue);

  const onChangeHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const { name, value } = event.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const onCheckHandler = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, checked } = event.target;

    setInputValue({
      ...inputValue,
      [name]: checked ? true : false,
    });
  };

  const clickEmojiHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    // currentTarget으로 버튼의 value 가져오기. if target -> img 값이 가져와짐
    const button = event.currentTarget as HTMLButtonElement;
    const emoId = Number(button.value);
    setInputValue({ ...inputValue, emoId: emoId });
  };

  const scoreStarHandler = (score: number) => {
    setInputValue({ ...inputValue, star: score });
  };

  return {
    onChangeHandler,
    onCheckHandler,
    clickEmojiHandler,
    inputValue,
    scoreStarHandler,
  };
};