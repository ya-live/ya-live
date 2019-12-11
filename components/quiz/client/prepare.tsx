import { Button } from 'antd';
import React, { useContext } from 'react';
import { useAuth } from '@/components/auth/hooks/auth_hooks';

import { QuizClientContext } from '../../../context/quiz/client/QuizClientContext';
import FirebaseAuthClient from '../../../models/commons/firebase_auth_client.model';
import styles from './body.css';

const Prepare: React.FC = () => {
  const { user: userInfo, haveUser } = useAuth();
  const ctx = useContext(QuizClientContext);
  const email = userInfo?.email || '';

  async function onClickSignOut() {
    await FirebaseAuthClient.getInstance().Auth.signOut();
    window.location.href = `/quiz/${ctx.quizID}`;
  }

  const prepareEle = (
    <>
      <div className={styles.descBox}>
        <span className={styles.desc}>잠시 후에 시작합니다!</span>
      </div>
      <b>{email}</b>
      <div className={styles.logoutBox}>
        계정을 변경하시려면
        <Button className={styles.logoutBtn} ghost onClick={onClickSignOut}>
          여기
        </Button>
        를 클릭해주세요.
      </div>
    </>
  );

  return (
    <section className={styles.container}>{haveUser ? prepareEle : '잘못된 접근입니다.'}</section>
  );
};

export default Prepare;
