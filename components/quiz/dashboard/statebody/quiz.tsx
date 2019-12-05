import React, { useContext } from 'react';
import Selectors from '../selectors';
import styles from './quiz.css';
import { QuizContext } from '@/context/quiz/dashboard/QuizContext';
import { EN_QUIZ_STATUS } from '@/models/quiz/interface/EN_QUIZ_STATUS';

const Quiz: React.FC = () => {
  const quiz = useContext(QuizContext);

  const correctAnswer =
    quiz.status === EN_QUIZ_STATUS.SHOW_RESULT ? quiz.quiz_correct_answer : undefined;

  return (
    <section>
      <h1 className={styles.heading}>yalive</h1>
      <h2 className={styles.theQuiz}>Q. {quiz.quiz_desc}</h2>
      {quiz.quiz_image_url && <img className={styles.quizImage} src={quiz.quiz_image_url} alt="" />}
      {quiz.quiz_selector && quiz.quiz_selector.length && (
        <Selectors options={quiz.quiz_selector} correctAnswer={correctAnswer} />
      )}
    </section>
  );
};

export default Quiz;
