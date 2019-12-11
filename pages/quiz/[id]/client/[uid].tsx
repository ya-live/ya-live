import { NextPage } from 'next';
import React from 'react';
import { useAuth } from '@/components/auth/hooks/auth_hooks';
import Container from '@/components/common/Container';
import Loading from '@/components/common/Loading';
import ClientBody from '@/components/quiz/client/body';

import { QuizClientContext } from '../../../../context/quiz/client/QuizClientContext';
import getStringValueFromQuery from '../../../../controllers/etc/get_value_from_query';

interface QuizClientProps {
  quizID?: string;
  userID?: string;
}

const QuizClient: NextPage<QuizClientProps> = ({ quizID = '', userID = '' }) => {
  const { initializing, user } = useAuth();

  const [name] = (user?.displayName || '').split('_');

  return (
    <QuizClientContext.Provider value={{ quizID, userID }}>
      <Container name={name}>
        <ClientBody />
        {initializing && <Loading />}
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
