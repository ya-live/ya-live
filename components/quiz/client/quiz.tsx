import React, { useContext, useState, useEffect } from 'react';
import clsx from 'clsx';
import { QuizOperation } from '../../../models/quiz/interface/I_quiz_operation';
import { EN_QUIZ_TYPE } from '../../../models/quiz/interface/EN_QUIZ_TYPE';
import styles from './quiz.css';
import { updateParticipantsForClient } from '../../../models/quiz/participants.client.service';
import { QuizClientContext } from '../../../context/quiz/client/QuizClientContext';
import Selector from './quiz/selector';
import { QuizParticipant } from '../../../models/quiz/interface/I_quiz_participant';
import { EN_QUIZ_STATUS } from '../../../models/quiz/interface/EN_QUIZ_STATUS';
import Calculate from './quiz/calculate';
import ShowResult from './quiz/result';
import Countdown from '../dashboard/countdown';

interface QuizProps {
  quiz: QuizOperation;
  user: QuizParticipant;
}

const Quiz: React.FC<QuizProps> = ({ quiz, user }) => {
  const ctx = useContext(QuizClientContext);
  const [selectedNo, setSelectedNo] = useState(user.select || -1);
  const [isFinishCount, setIsFinishCount] = useState(false);
  const [displayCount, setDisplayCount] = useState(10);

  useEffect(() => {
    if (quiz.status === EN_QUIZ_STATUS.COUNTDOWN) {
      startCountdown();
    }
  }, [quiz.status]);

  function startCountdown() {
    let countdown = 10;
    const count = setInterval(() => {
      if (countdown < 0) {
        setIsFinishCount(true);
        clearInterval(count);
      }

      setDisplayCount(countdown);
      countdown -= 1;
    }, 1000);
  }

  function select(no: number) {
    if (no === user.select) {
      return;
    }

    setSelectedNo(no);
    updateParticipantsForClient({
      uid: ctx.userID,
      quiz_id: ctx.quizID,
      info: { select: no, currentQuizID: quiz.quiz_id },
      isServer: false,
    });
  }

  const isPossibleQuiz =
    quiz.status === EN_QUIZ_STATUS.QUIZ || quiz.status === EN_QUIZ_STATUS.COUNTDOWN;
  const isDisabledSelect = !isPossibleQuiz || isFinishCount || !user.alive;

  const renderFromStatus = () => {
    switch (quiz.status) {
      case EN_QUIZ_STATUS.CALCULATE:
        return <Calculate />;
      case EN_QUIZ_STATUS.SHOW_RESULT:
        return (
          user.alive && (
            <ShowResult
              isResult={user.select === quiz.quiz_correct_answer}
              result={
                (quiz.quiz_selector &&
                  quiz.quiz_selector[(quiz.quiz_correct_answer || 0) - 1].title) ||
                ''
              }
            />
          )
        );
      default:
        return null;
    }
  };

  return (
    <section className={clsx(styles.container, !isPossibleQuiz && styles.hidden)}>
      <Countdown
        className={styles.countdown}
        active={quiz.status === EN_QUIZ_STATUS.COUNTDOWN && !isFinishCount}
        quizTime={displayCount}
      />
      <div className={styles.quizWrap}>
        <h1 className={styles.question}>{quiz.quiz_desc}</h1>
        {quiz.quiz_type === EN_QUIZ_TYPE.IMAGE && (
          <img className={styles.img} src={quiz.quiz_image_url} alt="" />
        )}
        <article className={styles.selectorBox}>
          {quiz.quiz_selector?.map((selector) => (
            <Selector
              key={selector.no}
              selector={selector}
              selectedNo={selectedNo}
              isShowResult={quiz.status === EN_QUIZ_STATUS.SHOW_RESULT}
              isDisabled={isDisabledSelect}
              result={quiz.quiz_correct_answer || -1}
              onClick={() => select(selector.no)}
            />
          ))}
        </article>
      </div>
      {renderFromStatus()}
    </section>
  );
};

export default Quiz;
