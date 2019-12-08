import { NextPage } from 'next';
import React from 'react';

import { useAuth } from '../components/auth/hooks/auth_hooks';
import Container from '../components/common/Container';
import Loading from '../components/common/Loading';
import LoginComplete from '../components/login/complete';
import Login from '../components/login/login';

/**
 * 참가자 로그인 / 대기 화면
 */
const IndexPage: NextPage = () => {
  const { initializing, haveUser, user } = useAuth();

  return (
    <>
      <Container>
        {haveUser ? (
          <LoginComplete displayName={user?.displayName} email={user?.email} />
        ) : (
          <Login />
        )}
      </Container>
      {initializing && <Loading />}
    </>
  );
};

export default IndexPage;
