import React, { useContext } from 'react';

import { QuizClientContext } from '../../../context/quiz/client/QuizClientContext';
import { EN_QUIZ_STATUS } from '../../../models/quiz/interface/EN_QUIZ_STATUS';
import { QuizOperation } from '../../../models/quiz/interface/I_quiz_operation';
import { QuizParticipant } from '../../../models/quiz/interface/I_quiz_participant';
import { useParticipantStoreDoc, useStoreDoc } from '../../auth/hooks/firestore_hooks';
import Prepare from './prepare';
import Quiz from './quiz';
import Idle from './idle';

const ClientBody: React.FC = () => {
  const ctx = useContext(QuizClientContext);
  const { docValue: quizFromStore } = useStoreDoc({
    collectionPath: 'quiz',
    docPath: ctx.quizID || 'none',
  });
  const { docValue: usersFromStore } = useParticipantStoreDoc({
    uid: ctx.userID,
    collectionPath: 'quiz',
    docPath: ctx.quizID,
  });

  const quizInfo = (() => {
    const dataFromFireStore = quizFromStore?.data();

    return dataFromFireStore && (dataFromFireStore as QuizOperation);
  })();

  const userInfo = (() => {
    const dataFromFireStore = usersFromStore?.data();

    return dataFromFireStore && (dataFromFireStore as QuizParticipant);
  })();

  if (!quizInfo || !userInfo) {
    return null;
  }

  const renderBody = () => {
    switch (quizInfo.status) {
      case EN_QUIZ_STATUS.IDLE:
        return <Idle />;
      case EN_QUIZ_STATUS.QUIZ:
      case EN_QUIZ_STATUS.COUNTDOWN:
      case EN_QUIZ_STATUS.CALCULATE:
      case EN_QUIZ_STATUS.SHOW_RESULT:
        return <Quiz quiz={quizInfo} user={userInfo} />;
      default:
        return <Prepare />;
    }
  };

  return renderBody();
};

export default ClientBody;
