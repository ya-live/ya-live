import { Button, Col, Row } from 'antd';
import React from 'react';

import { useAuth, userContext, useSession } from '../components/auth/hooks/auth_hooks';
import Layout from '../components/layout';
import FirebaseAuthClient from '../models/commons/firebase_auth_client.model';
import { MemberInfo } from '../models/members/interfaces/memberInfo';
import { memberAdd, memberFind } from '../models/members/members.client.service';

async function onClickSignIn() {
  const result = await FirebaseAuthClient.getInstance().signInWithGoogle();
  if (result.user) {
    const idToken = await result.user.getIdToken();
    const findResp = await memberFind({ member_id: result.user.uid, isServer: false });
    if (
      !(findResp.status === 200 && findResp.payload && findResp.payload.uid === result.user.uid)
    ) {
      const { uid, displayName, email, phoneNumber, photoURL } = result.user;
      const data: MemberInfo = {
        uid,
        displayName: displayName || undefined,
        email: email || undefined,
        phoneNumber: phoneNumber || undefined,
        photoURL: photoURL || undefined,
      };
      await memberAdd({
        data,
        token: idToken,
        isServer: false,
      });
    }
    window.location.href = '/';
  }
}

async function onClickSignOut() {
  await FirebaseAuthClient.getInstance().Auth.signOut();
  console.log('done');
}

function SignOut() {
  const user = useSession();
  const renderElement = (
    <Button size="large" icon="exit" onClick={onClickSignOut}>
      {`Sign out ${user ? user.email : ''}`}
    </Button>
  );
  return renderElement;
}

const SignIn = () => {
  const { initializing, haveUser, user } = useAuth();
  if (initializing) {
    return (
      <Layout title="sign in">
        <Row>
          <Col span={12} offset={6} style={{ textAlign: 'center' }}>
            <div style={{ margin: '10% 0' }}>Loading...</div>
          </Col>
        </Row>
      </Layout>
    );
  }
  const signInBtn = (
    <>
      Sign in with:{' '}
      <Button size="large" icon="google" onClick={onClickSignIn}>
        Google
      </Button>
    </>
  );
  const signOutBtn = (
    <userContext.Provider value={{ user }}>
      <SignOut />
    </userContext.Provider>
  );
  return (
    <Layout title="sign in">
      <Row>
        <Col span={12} offset={6} style={{ textAlign: 'center' }}>
          <div style={{ margin: '10% 0' }}>{haveUser ? signOutBtn : signInBtn}</div>
        </Col>
      </Row>
    </Layout>
  );
};

export default SignIn;
