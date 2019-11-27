import React, { useState } from 'react';

import { Radio } from 'antd';

import { EN_QUIZ_STATUS } from '../../models/quiz/interface/EN_QUIZ_STATUS';
import { QuizOperation } from '../../models/quiz/interface/I_quiz_operation';

interface Props {
  /** 진행 상태 */
  status: EN_QUIZ_STATUS;
  /** 퀴즈 정보 */
  info?: QuizOperation;
  /** 번호 선택 시 전달하는 메서드 */
  handleClick({ no, quiz_id }: { no: number; quiz_id: string }): void;
  /** 유효한 사용자인가? */
  possiblePlayer?: boolean;
}

const QuizDisplay: React.FunctionComponent<Props> = ({
  status,
  info,
  handleClick,
  possiblePlayer = false,
}) => {
  const [selectedNo, updateSelectNo] = useState(0);
  if (
    !(
      status === EN_QUIZ_STATUS.QUIZ ||
      status === EN_QUIZ_STATUS.COUNTDOWN ||
      status === EN_QUIZ_STATUS.SHOW_RESULT ||
      status === EN_QUIZ_STATUS.CALCULATE
    )
  ) {
    return null;
  }
  const desc = info?.quiz_desc;
  const selectors = info?.quiz_selector
    ?.sort((a, b) => a.no - b.no)
    .map((mv) => <Radio value={mv.no}>{mv.title}</Radio>);

  return (
    <div>
      <p>{desc}</p>
      <Radio.Group
        disabled={!possiblePlayer || status !== EN_QUIZ_STATUS.COUNTDOWN}
        onChange={(e) => {
          const updateNo: number = e.target.value;
          const quizID = info?.quiz_id ? info.quiz_id : 'none';
          updateSelectNo(updateNo);
          handleClick({ no: updateNo, quiz_id: quizID });
        }}
        value={selectedNo}
      >
        {selectors}
      </Radio.Group>
    </div>
  );
};

export default QuizDisplay;
