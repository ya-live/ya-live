import React from 'react';
import { animated, useSpring } from 'react-spring';
import { SelectorItem } from '@/models/quiz/interface/I_quiz_operation';
import styles from './bar.css';
import { EN_QUIZ_STATUS } from '@/models/quiz/interface/EN_QUIZ_STATUS';

interface BarProps {
  correctAnswer?: number;
  option: SelectorItem;
  percentage?: number;
  status: EN_QUIZ_STATUS;
}

const Bar: React.FC<BarProps> = ({ correctAnswer, option, percentage, status }) => {
  const highlightCorrectOne = !!correctAnswer && status === EN_QUIZ_STATUS.SHOW_RESULT;
  const isCorrectAnswer = highlightCorrectOne && option.no === correctAnswer;

  const meterStyle = useSpring({
    transform: `scaleX(${isCorrectAnswer ? 1 : percentage || 0})`,
  });

  return (
    <li key={option.no} className={styles.option}>
      <animated.div
        className={isCorrectAnswer ? styles.correctHighlight : styles.gauge}
        style={meterStyle}
      />
      <span className={styles.label}>{option.title}</span>
    </li>
  );
};

export default Bar;
