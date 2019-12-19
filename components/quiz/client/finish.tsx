import React from 'react';
import styles from './finish.css';

const Finish: React.FC = () => (
  <div className={styles.container}>
    <div className={styles.yalive}>yalive</div>
    참여해주셔서 감사합니다.
    <span role="img" aria-label="">
      💫
    </span>
  </div>
);

export default Finish;
