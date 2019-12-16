import React from 'react';

import clsx from 'clsx';
import styles from './Container.css';

const Container: React.FC<{ name?: string; isFixed?: boolean }> = ({ name, isFixed, children }) => (
  <div className={clsx(styles.container, isFixed && styles.fixedContainer)}>
    <div className={styles.heading}>
      <p className={styles.logo}>yalive</p>
      {name && <p className={styles.name}>{name}님</p>}
    </div>
    <div className={styles.content}>{children}</div>
  </div>
);

export default Container;
