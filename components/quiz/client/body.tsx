import React, { useContext } from 'react';

import { QuizClientContext } from '../../../context/quiz/client/QuizClientContext';
import { EN_QUIZ_STATUS } from '../../../models/quiz/interface/EN_QUIZ_STATUS';
import Prepare from './prepare';
import Quiz from './quiz';
import Idle from './idle';
import Finish from './finish';

const ClientBody: React.FC = () => {
  const ctx = useContext(QuizClientContext);

  return (() => {
    switch (ctx.quiz?.status) {
      case EN_QUIZ_STATUS.IDLE:
        return <Idle isAlive={!!ctx.user?.alive} />;
      case EN_QUIZ_STATUS.QUIZ:
      case EN_QUIZ_STATUS.COUNTDOWN:
      case EN_QUIZ_STATUS.CALCULATE:
      case EN_QUIZ_STATUS.SHOW_RESULT:
        return <Quiz />;
      case EN_QUIZ_STATUS.FINISH:
        return <Finish />;
      default:
        return <Prepare />;
    }
  })();
};

export default ClientBody;
