import React from 'react';

import styles from './idle.css';

const Idle: React.FC<{ isAlive: boolean }> = () => (
  <div
    className={styles.container}
    onTouchStart={(e) => e.preventDefault()}
    onTouchMove={(e) => e.preventDefault()}
  >
    <span className={styles.text}>
      다음 문제가 곧 시작됩니다!
      <span role="img" aria-label="ㅇ_ㅇ">
        👀
      </span>
    </span>
  </div>
);

export default Idle;
