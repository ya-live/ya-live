import React from 'react';

import styles from './Container.css';

const Container: React.FC<{ name?: string }> = ({ name, children }) => (
  <div className={styles.container}>
    <div className={styles.heading}>
      <p className={styles.logo}>yaLive</p>
      {name && <p className={styles.name}>{name}님</p>}
    </div>
    <div className={styles.content}>{children}</div>
  </div>
);

export default Container;
