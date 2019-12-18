import React, { useContext } from 'react';
import styles from './quiz_desc.css';
import { QuizContext } from '@/context/quiz/dashboard/QuizContext';

const QuizDesc: React.FC = () => {
  const { quiz } = useContext(QuizContext);

  return (
    <section>
      <h2 className={styles.quizText}>Q. {quiz.quiz_desc}</h2>
    </section>
  );
};

export default QuizDesc;
