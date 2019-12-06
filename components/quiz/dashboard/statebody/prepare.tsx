import React from 'react';
import styles from './prepare.css';

const Prepare: React.FC = () => (
  <section className={styles.container}>
    <div>
      <h1 className={styles.heading}>yalive</h1>
      <p className={styles.caption}>
        <span className={styles.highlight}>잠시 후에 시작합니다!</span>
      </p>
    </div>
  </section>
);

export default Prepare;
