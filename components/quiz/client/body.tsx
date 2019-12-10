import React, { useContext } from 'react';

import { Button } from 'antd';
import FirebaseAuthClient from '../../../models/commons/firebase_auth_client.model';
import { QuizClientStoreCtx } from '../../../store/client/QuizClientStore';
import { useAuth } from '@/components/auth/hooks/auth_hooks';
import styles from './body.css';

const ClientBody: React.FC = () => {
  const { user: userInfo } = useAuth();
  const store = useContext(QuizClientStoreCtx);
  const email = userInfo?.email || '';

  async function onClickSignOut() {
    await FirebaseAuthClient.getInstance().Auth.signOut();
    window.location.href = `/quiz/${store.quizID}`;
  }

  console.log(store.quizID, store.userID);

  return (
    <section className={styles.container}>
      <div>
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
      </div>
    </section>
  );
};

export default ClientBody;
