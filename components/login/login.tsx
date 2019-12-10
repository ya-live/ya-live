import { Button } from 'antd';
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
    <div className={styles.titleBox}>
      <span className={styles.year}>2019 </span>
      <span className={styles.yalive}>
        yalive
        <span role="img" aria-label="gift">
          🎁
        </span>
      </span>
    </div>
    <div className={styles.loginDesc}>
      주인공이 되고 싶다면 지금 바로
      <Button className={styles.loginBtn} onClick={onClickSignIn}>
        login
      </Button>
      하세요.
    </div>
  </section>
);

export default Login;
