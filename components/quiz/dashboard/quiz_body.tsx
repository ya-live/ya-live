import React, { useContext, useEffect, useState, useRef } from 'react';
import { QuizContext } from '@/context/quiz/dashboard/QuizContext';
import { EN_QUIZ_STATUS } from '@/models/quiz/interface/EN_QUIZ_STATUS';
import Cover from './cover';
import styles from './quiz_body.css';
import QuizDesc from './quiz_desc';
import Selectors, { QuizAnswers } from './selectors';
import FirebaseAuthClient from '@/models/commons/firebase_auth_client.model';
import { QuizParticipant } from '@/models/quiz/interface/I_quiz_participant';
import Countdown, { COUNTDOWN } from './countdown';

const isItCoverable = (status: EN_QUIZ_STATUS): boolean => {
  switch (status) {
    case EN_QUIZ_STATUS.QUIZ:
    case EN_QUIZ_STATUS.SHOW_RESULT:
    case EN_QUIZ_STATUS.COUNTDOWN:
    case EN_QUIZ_STATUS.CALCULATE:
      return false;
    default:
      return true;
  }
};

const countParticipantAnswers = async (
  id: string,
  setter: React.Dispatch<React.SetStateAction<QuizAnswers>>,
) => {
  const aliveParticipants = await FirebaseAuthClient.getInstance()
    .FireStore.collection(`quiz/${id}/participants`)
    .where('alive', '==', true)
    .get();
  setter(
    aliveParticipants.docs
      .map((docs) => docs.data() as QuizParticipant)
      .reduce(
        (acc, cur) => {
          acc[cur.select ? cur.select - 1 : 4] += 1;
          return acc;
        },
        [0, 0, 0, 0, 0],
      ),
  );
};

const doCountdown = (
  intervalRef: React.MutableRefObject<number | null>,
  setter: React.Dispatch<React.SetStateAction<number>>,
) => {
  setter((time) => {
    if (intervalRef.current !== null && time === 0) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return time - 1;
  });
};

const QuizBody: React.FC = () => {
  const clockInterval = useRef<number | null>(null);
  const { id, quiz } = useContext(QuizContext);
  const [answers, setAnswers] = useState<QuizAnswers>([0, 0, 0, 0, 0]);
  const [quizTime, setQuizTime] = useState(COUNTDOWN);

  const clearClock = () => {
    setQuizTime(COUNTDOWN);
    if (clockInterval.current !== null) {
      window.clearInterval(clockInterval.current);
    }
  };

  useEffect(() => {
    if (quiz.status !== EN_QUIZ_STATUS.COUNTDOWN) {
      clearClock();
      return;
    }

    setQuizTime(COUNTDOWN);
    clockInterval.current = window.setInterval(() => doCountdown(clockInterval, setQuizTime), 1000);

    return clearClock;
  }, [quiz.status]);

  useEffect(() => {
    if (quiz.status === EN_QUIZ_STATUS.CALCULATE || quiz.status === EN_QUIZ_STATUS.SHOW_RESULT) {
      if (answers.every((answer) => answer === 0)) {
        countParticipantAnswers(id, setAnswers);
      }
    } else {
      setAnswers([0, 0, 0, 0, 0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, id, quiz.status]);

  const coverActive = isItCoverable(quiz.status);

  return (
    <section className={styles.container}>
      <h1 className={styles.yalive}>yalive</h1>
      <Cover active={coverActive} status={quiz.status} />
      <Countdown
        active={quiz.status === EN_QUIZ_STATUS.COUNTDOWN && quizTime >= 0}
        quizTime={quizTime}
      />
      <div className={styles.wrap}>
        <QuizDesc />
        {quiz.quiz_selector && (
          <Selectors
            answers={answers}
            correctAnswer={quiz.quiz_correct_answer}
            options={quiz.quiz_selector}
            status={quiz.status}
          />
        )}
      </div>
    </section>
  );
};

export default QuizBody;
