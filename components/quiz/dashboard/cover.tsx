import React from 'react';
import { animated, useSpring } from 'react-spring';
import styles from './cover.css';
import { EN_QUIZ_STATUS } from '@/models/quiz/interface/EN_QUIZ_STATUS';

interface CoverProps {
  active: boolean;
  status: EN_QUIZ_STATUS;
}

const getCaption = (status: EN_QUIZ_STATUS): string => {
  switch (status) {
    case EN_QUIZ_STATUS.COUNTDOWN:
    case EN_QUIZ_STATUS.CALCULATE:
      return '집계 중...';
    case EN_QUIZ_STATUS.FINISH:
      return '(대충 끝났다는 말)';
    default:
      return '잠시 후에 시작합니다!';
  }
};

const Cover: React.FC<CoverProps> = ({ active, status }) => {
  const containerStyle = useSpring({
    opacity: active ? 1 : 0,
  });

  const caption = getCaption(status);

  return (
    <animated.section className={styles.container} style={containerStyle}>
      <div>
        <h1 className={styles.heading}>YAQUIZ</h1>
        {caption && (
          <p className={styles.caption}>
            <span className={styles.highlight}>{caption}</span>
          </p>
        )}
      </div>
    </animated.section>
  );
};

export default Cover;
