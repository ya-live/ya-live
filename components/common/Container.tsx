import React from 'react';

import styles from './Container.css';

const Container: React.FC = ({ children }) => (
  <div className={styles.container}>
    <div className={styles.heading}>
      <p className={styles.logo}>yaLive</p>
    </div>
    <div className={styles.content}>{children}</div>
  </div>
);

export default Container;
