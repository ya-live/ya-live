import React from 'react';

import styles from './calculate.css';

const Calculate: React.FC = () => (
  <div className={styles.container}>
    <p className={styles.textBox}>
      <span className={styles.text}>~ 집계중 ~</span>
    </p>
  </div>
);

export default Calculate;
