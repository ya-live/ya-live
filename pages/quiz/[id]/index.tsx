import { NextPage } from 'next';
import React from 'react';

import { useAuth } from '../../../components/auth/hooks/auth_hooks';
import Container from '../../../components/common/Container';
import Loading from '../../../components/common/Loading';
import Login from '../../../components/login/login';
import getStringValueFromQuery from '../../../controllers/etc/get_value_from_query';

interface ClientLoginProps {
  quizID?: string;
}

/**
 * 참가자 로그인 / 대기 화면
 */
const ClientLoginPage: NextPage<ClientLoginProps> = ({ quizID }) => {
  const { initializing, haveUser, user } = useAuth();

  if (haveUser && user?.uid) {
    window.location.href = `/quiz/${quizID}/client/${user?.uid}`;
  }

  return (
    <Container>
      <Login />
      {initializing && <Loading />}
    </Container>
  );
};

ClientLoginPage.getInitialProps = async ({ query }) => {
  const quizID = getStringValueFromQuery({ query, field: 'id' });

  return {
    quizID,
  };
};

export default ClientLoginPage;
