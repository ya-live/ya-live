import { NextPage } from 'next';
import React from 'react';

import Container from '../../../components/common/Container';
import Login from '../../../components/login/login';
import getStringValueFromQuery from '../../../controllers/etc/get_value_from_query';

interface ClientLoginProps {
  quizID?: string;
}

/**
 * 참가자 로그인 / 대기 화면
 */
const ClientLoginPage: NextPage<ClientLoginProps> = ({ quizID }) => (
  <Container>
    <Login quizID={quizID || ''} />
  </Container>
);

ClientLoginPage.getInitialProps = async ({ query }) => {
  const quizID = getStringValueFromQuery({ query, field: 'id' });

  return {
    quizID,
  };
};

export default ClientLoginPage;
