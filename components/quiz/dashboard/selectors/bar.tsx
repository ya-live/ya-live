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

  const gaugeClass = (() => {
    if (!highlightCorrectOne) {
      return styles.gauge;
    }

    return option.no === correctAnswer ? styles.correctGauge : styles.incorrectGauge;
  })();

  const { value } = useSpring({
    value: isCorrectAnswer ? 1 : percentage || 0,
  });

  return (
    <li key={option.no} className={styles.option}>
      <animated.div
        className={gaugeClass}
        style={{
          clipPath: value.interpolate((x) => `inset(0 ${100 * (1 - x)}% 0 0)`),
        }}
      />
      <span className={styles.label}>{option.title}</span>
      {percentage !== undefined && (
        <span className={styles.percentage}>{Math.round(percentage * 100)}%</span>
      )}
    </li>
  );
};

export default Bar;
