import React from 'react';

import styles from './idle.css';

const Idle: React.FC = () => (
  <div className={styles.container}>
    <span className={styles.text}>
      다음 문제가 곧 시작합니다!
      <span role="img" aria-label="ㅇ_ㅇ">
        👀
      </span>
    </span>
  </div>
);

export default Idle;
