import { memberAdd, memberFind } from '../../models/members/members.client.service';

import { Button } from 'antd';
import { EN_QUIZ_STATUS } from '../../models/quiz/interface/EN_QUIZ_STATUS';
import FirebaseAuthClient from '../../models/commons/firebase_auth_client.model';
import { MemberInfo } from '../../models/members/interfaces/memberInfo';
import { QuizOperation } from '../../models/quiz/interface/I_quiz_operation';
import React from 'react';
import styles from './login.css';
import { useStoreDoc } from '../auth/hooks/firestore_hooks';

const Login: React.FC<{ quizID: string }> = ({ quizID }) => {
  const { docValue } = useStoreDoc({ collectionPath: 'quiz', docPath: quizID || 'none' });
  const quizInfo = docValue?.data() as QuizOperation;

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
      window.location.href = `/quiz/${quizID}/client/${result.user.uid}`;
    }
  }

  const renderBody = () => {
    if (!quizInfo) {
      return null;
    }

    if (quizInfo.status === EN_QUIZ_STATUS.PREPARE || quizInfo.status === EN_QUIZ_STATUS.INIT) {
      return (
        <>
          <span className={styles.yalive}>
            YAQUIZ
            <span role="img" aria-label="gift">
              🎁
            </span>
          </span>
          <div className={styles.loginDesc}>
            참여하고 싶다면
            <Button className={styles.loginBtn} onClick={onClickSignIn}>
              login
            </Button>
          </div>
        </>
      );
    }

    return (
      <>
        퀴즈가 이미 시작되어, <br />
        참여하실 수 없습니다.
      </>
    );
  };

  return (
    <section className={styles.container}>
      <div className={styles.titleBox}>{renderBody()}</div>
    </section>
  );
};

export default Login;
