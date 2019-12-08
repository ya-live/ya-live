import React from 'react';

import FirebaseAuthClient from '../../models/commons/firebase_auth_client.model';
import { MemberInfo } from '../../models/members/interfaces/memberInfo';
import { memberAdd, memberFind } from '../../models/members/members.client.service';
import styles from './login.css';

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
  }
}

const Login: React.FC = () => (
  <section className={styles.container}>
    <button type="button" className={styles.loginButton} onClick={onClickSignIn}>
      2019 <span className={styles.emphasis}>yaLive</span>
      <br />
      참가하러 가기
    </button>
    <p className={styles.caption}>야놀자 계정을 이용해주세요.</p>
  </section>
);

export default Login;
