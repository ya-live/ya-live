import { NextPage } from 'next';
import React from 'react';
import { useAuth } from '@/components/auth/hooks/auth_hooks';
import Container from '@/components/common/Container';
import ClientBody from '@/components/quiz/client/body';

import { QuizClientContext } from '../../../../context/quiz/client/QuizClientContext';
import getStringValueFromQuery from '../../../../controllers/etc/get_value_from_query';
import {
  useStoreDoc,
  useParticipantStoreDoc,
} from '../../../../components/auth/hooks/firestore_hooks';
import { QuizOperation } from '../../../../models/quiz/interface/I_quiz_operation';
import { QuizParticipant } from '../../../../models/quiz/interface/I_quiz_participant';
import { EN_QUIZ_STATUS } from '../../../../models/quiz/interface/EN_QUIZ_STATUS';

interface QuizClientProps {
  quizID?: string;
  userID?: string;
}

const QuizClient: NextPage<QuizClientProps> = ({ quizID = '', userID = '' }) => {
  const { user } = useAuth();

  const { docValue: quizFromStore } = useStoreDoc({
    collectionPath: 'quiz',
    docPath: quizID || 'none',
  });
  const { docValue: usersFromStore } = useParticipantStoreDoc({
    uid: userID,
    collectionPath: 'quiz',
    docPath: quizID,
  });

  const quiz = (() => {
    const dataFromFireStore = quizFromStore?.data();

    return dataFromFireStore && (dataFromFireStore as QuizOperation);
  })();

  const userInfo = (() => {
    const dataFromFireStore = usersFromStore?.data();

    return dataFromFireStore && (dataFromFireStore as QuizParticipant);
  })();
  const [name] = (user?.displayName || '').split('_');

  return (
    <QuizClientContext.Provider value={{ quizID, userID, quiz, user: userInfo }}>
      <Container
        name={name}
        isFixed={quiz?.status !== EN_QUIZ_STATUS.QUIZ && quiz?.status !== EN_QUIZ_STATUS.COUNTDOWN}
      >
        <ClientBody />
      </Container>
    </QuizClientContext.Provider>
  );
};

QuizClient.getInitialProps = async ({ query }) => {
  const quizID = getStringValueFromQuery({ query, field: 'id' });
  const userID = getStringValueFromQuery({ query, field: 'uid' });

  return { quizID, userID };
};

export default QuizClient;
