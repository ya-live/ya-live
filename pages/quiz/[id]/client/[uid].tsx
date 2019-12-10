import { NextPage } from 'next';
import React, { useRef } from 'react';

import { useAuth } from '../../../../components/auth/hooks/auth_hooks';
import getStringValueFromQuery from '../../../../controllers/etc/get_value_from_query';
import Loading from '@/components/common/Loading';
import ClientBody from '@/components/quiz/client/body';
import Container from '@/components/common/Container';
import QuizClientStore from '@/store/client/QuizClientStore';
import { QuizClientStoreCtx } from '../../../../store/client/QuizClientStore';

interface QuizClientProps {
  quizID?: string;
  userID?: string;
}

const QuizClient: NextPage<QuizClientProps> = ({ quizID = '', userID = '' }) => {
  const { initializing, user } = useAuth();
  const store = useRef(new QuizClientStore(quizID, userID)).current;

  const [name] = (user?.displayName || '').split('_');

  return (
    <QuizClientStoreCtx.Provider value={store}>
      <Container name={name}>
        <ClientBody />
        {initializing && <Loading />}
      </Container>
    </QuizClientStoreCtx.Provider>
  );
};

QuizClient.getInitialProps = async ({ query }) => {
  const quizID = getStringValueFromQuery({ query, field: 'id' });
  const userID = getStringValueFromQuery({ query, field: 'uid' });

  return { quizID, userID };
};

export default QuizClient;
