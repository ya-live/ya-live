import React from 'react';
import clsx from 'clsx';
import styles from './result.css';

const ShowResult: React.FC<{ isResult: boolean; result: string }> = ({ isResult, result }) => {
  const imoji = isResult ? '🎊' : '💣';
  const title = isResult ? '정답!' : '탈락';
  const desc = isResult ? '다음 문제도 화이팅 ~' : '창을 꺼주셔도 좋습니다';

  return (
    <div className={styles.container}>
      <div className={styles.msgBox}>
        <span className={styles.imoji} role="img" aria-label={title}>
          {imoji}
        </span>
        <h1 className={clsx(styles.title, isResult ? styles.successTitle : styles.failTitle)}>
          {title}
        </h1>
        {!isResult && '정답'}
        <div className={styles.result}>{result}</div>
        <div className={styles.desc}>{desc}</div>
      </div>
    </div>
  );
};

export default ShowResult;
