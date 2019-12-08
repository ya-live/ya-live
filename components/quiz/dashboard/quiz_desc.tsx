import React, { useContext } from 'react';
import styles from './quiz_desc.css';
import { QuizContext } from '@/context/quiz/dashboard/QuizContext';
import { EN_QUIZ_TYPE } from '@/models/quiz/interface/EN_QUIZ_TYPE';

const QuizDesc: React.FC = () => {
  const { quiz } = useContext(QuizContext);

  return (
    <section>
      {quiz.quiz_type === EN_QUIZ_TYPE.IMAGE && quiz.quiz_image_url && (
        <img className={styles.quizImage} src={quiz.quiz_image_url} alt="" />
      )}
      <h2 className={styles.quizText}>Q. {quiz.quiz_desc}</h2>
    </section>
  );
};

export default QuizDesc;
