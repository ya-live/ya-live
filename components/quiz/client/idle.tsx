import React, { useEffect, useContext } from 'react';

import styles from './idle.css';
import { QuizClientContext } from '@/context/quiz/client/QuizClientContext';

const Idle: React.FC<{ isAlive: boolean }> = ({ isAlive }) => {
  const ctx = useContext(QuizClientContext);

  useEffect(() => {
    if (!isAlive) {
      window.location.href = '/'; // TODO: 종료 페이지를 만들자
    }
  }, [ctx.quizID, isAlive]);

  return (
    <div className={styles.container}>
      <span className={styles.text}>
        다음 문제가 곧 시작합니다!
        <span role="img" aria-label="ㅇ_ㅇ">
          👀
        </span>
      </span>
    </div>
  );
};

export default Idle;
