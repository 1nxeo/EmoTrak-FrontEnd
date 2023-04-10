import React, { useState } from 'react';

import styled from 'styled-components';
import Sidebar from './Sidebar';
import Flex from '../../../components/Flex';
import { useQuery } from '@tanstack/react-query';
import { keys } from '../../../data/queryKeys/keys';
import user from '../../../lib/api/user';
import { date } from '../../../data/type/d1';
import { ModalContent, Modalroot } from '../../../components/Modal';
import ClickModalPost from './ClickModalPost';

const Calendar = (): JSX.Element => {
  const today: date = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    date: new Date().getDate(),
    day: new Date().getDay(),
  };
  const weeks: string[] = ['일', '월', '화', '수', '목', '금', '토'];

  // 날짜 선택
  const [select, setSelectMonth] = useState<date>({
    year: today.year,
    month: today.month,
  });

  const lastDate: number = new Date(select.year, select.month, 0).getDate();
  const firstDay: number = new Date(select.year, select.month - 1, 1).getDay();

  const [diaryDay, setDiaryDay] = useState<date>({
    year: select.year,
    month: select.month,
    date: today.date,
  });

  const [side, setSide] = useState(false);

  //해당 요일의 값 가져오는 함수
  const dateSelect = (e: React.MouseEvent<HTMLButtonElement>): void => {
    setSide(true);
    const btn = e.target as HTMLButtonElement;
    setDiaryDay({ ...diaryDay, date: Number(btn.value) });
  };

  // 날짜 변환 함수
  const date = new Array(lastDate).fill(null).map(
    (e, i): date => ({
      year: select.year,
      month: select.month,
      date: i + 1,
      day: new Date(select.year, select.month - 1, i + 1).getDay(),
    })
  );
  // console.log(arr);

  const prevMonth = (): void => {
    select.month === 1
      ? setSelectMonth({ month: 12, year: select.year - 1 })
      : setSelectMonth({ ...select, month: select.month - 1 });
  };

  const nextMonth = (): void => {
    select.month === 12
      ? setSelectMonth({ month: 1, year: select.year + 1 })
      : setSelectMonth({ ...select, month: select.month + 1 });
  };

  const thisMonth = (): void => {
    setSelectMonth({ year: today.year, month: today.month });
  };

  const { data, isLoading } = useQuery({
    queryKey: [keys.GET_DIARY],
    queryFn: async () => {
      const data = await user.get('/daily', { params: select });
      return data.data.data;
    },
  });
  console.log(data);

  if (isLoading) {
    return <>로딩중입니다</>;
  }
  return (
    <Flex row>
      <CalendarBox>
        <button onClick={prevMonth}>이전달</button>
        <h1>
          {select.year}년 {select.month}월
        </h1>
        <button onClick={nextMonth}>다음달</button>
        <button onClick={thisMonth}>이번달</button>

        <TotalWeek>
          {weeks.map(
            (v: string): JSX.Element => (
              <TotalWeek key={v}>{v}</TotalWeek>
            )
          )}
        </TotalWeek>
        <DiaryDay>
          {new Array(firstDay).fill(null).map((e, i) => (
            <Day key={i}></Day>
          ))}
          {date.map((e) => (
            <Day key={e.date} value={e.date} onClick={dateSelect}>
              {e.date}
            </Day>
          ))}
        </DiaryDay>
      </CalendarBox>
      {side && <Sidebar side={side} setSide={setSide} data={data} diaryDay={diaryDay} />}
    </Flex>
  );
};

const CalendarBox = styled.div`
  width: 60vw;
  border: 1px solid;
  margin-left: auto;
  margin-right: auto;
`;

const DiaryDay = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 40vw;
  background-color: aliceblue;
`;
const TotalWeek = styled.div`
  min-width: calc(100% / 7);
  border: 1px solid;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
`;

const Day = styled.button`
  min-width: calc(100% / 7);
  display: flex;
  justify-content: center;
  box-sizing: border-box;
`;
const Sunday = styled.button`
  color: red;
  min-width: calc(100% / 7);
  display: flex;
  justify-content: center;
  box-sizing: border-box;
`;
const Saturday = styled.button`
  color: blue;
  min-width: calc(100% / 7);
  display: flex;
  justify-content: center;
  box-sizing: border-box;
`;

const Today = styled.button`
  color: #fc1efc;
  min-width: calc(100% / 7);
  display: flex;
  justify-content: center;
  box-sizing: border-box;
`;

export default Calendar;
