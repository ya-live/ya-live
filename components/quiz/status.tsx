import React from 'react';

import { EN_QUIZ_STATUS } from '../../models/quiz/interface/EN_QUIZ_STATUS';

interface Props {
  status: EN_QUIZ_STATUS;
  title?: string;
}

function getPrintTitle({ status, title }: { status: EN_QUIZ_STATUS; title: string }) {
  if (status === EN_QUIZ_STATUS.INIT) {
    return title;
  }

  if (status === EN_QUIZ_STATUS.PREPARE) {
    return '퀴즈 시작 전';
  }

  if (status === EN_QUIZ_STATUS.IDLE) {
    return title;
  }

  if (status === EN_QUIZ_STATUS.COUNTDOWN) {
    return '';
  }

  if (status === EN_QUIZ_STATUS.QUIZ) {
    return '';
  }

  if (status === EN_QUIZ_STATUS.SHOW_RESULT) {
    return '정답 공개';
  }

  if (status === EN_QUIZ_STATUS.CALCULATE) {
    return '집계중';
  }
}

const QuizStatus: React.FunctionComponent<Props> = ({ status, title = '준비중' }) => {
  const printTitle = getPrintTitle({ status, title });
  return <div>{printTitle}</div>;
};

export default QuizStatus;
