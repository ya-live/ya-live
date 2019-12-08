import React from 'react';

import styles from './Loading.css';

const Loading: React.FC = () => (
  <div className={styles.container}>
    <p className={styles.loadingText}>Loading...</p>
  </div>
);

export default Loading;
