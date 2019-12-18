import React from 'react';
import { SelectorItem } from '@/models/quiz/interface/I_quiz_operation';
import styles from './selectors.css';
import { EN_QUIZ_STATUS } from '@/models/quiz/interface/EN_QUIZ_STATUS';
import Bar from './bar';
import { QuizAnswers } from '.';

interface SelectorsProps {
  answers: QuizAnswers;
  options: readonly SelectorItem[];
  correctAnswer?: number;
  status: EN_QUIZ_STATUS;
}

const Selectors: React.FC<SelectorsProps> = ({ answers, correctAnswer, options, status }) => {
  const showAnswerPercentage =
    status === EN_QUIZ_STATUS.CALCULATE || status === EN_QUIZ_STATUS.SHOW_RESULT;
  const totalCount = answers.reduce((acc, cur) => acc + cur);

  const makePercentage = (index: number): number | undefined => {
    if (!showAnswerPercentage) {
      return;
    }
    return totalCount ? answers[index] / totalCount : 0;
  };

  return (
    <ul className={styles.container}>
      {options.map((option, index) => (
        <Bar
          key={option.no}
          correctAnswer={correctAnswer}
          option={option}
          percentage={makePercentage(index)}
          status={status}
        />
      ))}
    </ul>
  );
};

export default Selectors;
