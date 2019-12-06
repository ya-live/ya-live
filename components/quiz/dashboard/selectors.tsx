import React from 'react';
import { SelectorItem } from '@/models/quiz/interface/I_quiz_operation';
import styles from './selectors.css';

interface SelectorsProps {
  options: readonly SelectorItem[];
  correctAnswer?: number;
}

const Selectors: React.FC<SelectorsProps> = ({ options, correctAnswer }) => (
  <ul className={styles.container}>
    {options.map((option) => (
      <li
        key={option.no}
        className={option.no === correctAnswer ? styles.correctOption : styles.option}
      >
        {option.title}
      </li>
    ))}
  </ul>
);

export default Selectors;
