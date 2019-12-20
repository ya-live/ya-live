import React, { useContext, useState, useEffect } from 'react';
import clsx from 'clsx';
import { EN_QUIZ_TYPE } from '../../../models/quiz/interface/EN_QUIZ_TYPE';
import styles from './quiz.css';
import { updateParticipantsForClient } from '../../../models/quiz/participants.client.service';
import { QuizClientContext } from '../../../context/quiz/client/QuizClientContext';
import Selector from './quiz/selector';
import { EN_QUIZ_STATUS } from '../../../models/quiz/interface/EN_QUIZ_STATUS';
import Calculate from './quiz/calculate';
import ShowResult from './quiz/result';
import Countdown from '../dashboard/countdown';

const Quiz: React.FC = () => {
  const ctx = useContext(QuizClientContext);
  const [selectedNo, setSelectedNo] = useState(
    ctx.user?.alive && ctx.user?.currentQuizID === ctx.quiz?.quiz_id ? ctx.user?.select || -1 : -1,
  );
  const [disabled, setDisabled] = useState(false); // 선택하고 user.select 업데이트 되기까지 disabled
  const [isFinishCount, setIsFinishCount] = useState(false);
  const [displayCount, setDisplayCount] = useState(10);

  useEffect(() => {
    setSelectedNo(
      ctx.user?.alive && ctx.user?.currentQuizID === ctx.quiz?.quiz_id
        ? ctx.user?.select || -1
        : -1,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.user]);

  useEffect(() => {
    if (ctx.quiz?.status === EN_QUIZ_STATUS.COUNTDOWN) {
      startCountdown();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.quiz?.status]);

  function startCountdown() {
    let countdown = 10;
    const count = setInterval(() => {
      if (countdown < 0) {
        setIsFinishCount(true);
        clearInterval(count);
      }

      if (countdown === 3) {
        // eslint-disable-next-line no-unused-expressions
        window.navigator.vibrate && window.navigator.vibrate([800, 200, 800, 200, 800]);
      }

      setDisplayCount(countdown);
      countdown -= 1;
    }, 1000);
  }

  async function select(no: number) {
    if (no === ctx.user?.select && !ctx.user?.alive) {
      return;
    }

    setSelectedNo(no);
    setDisabled(true);
    await updateParticipantsForClient({
      uid: ctx.userID,
      quiz_id: ctx.quizID,
      info: { select: no, currentQuizID: ctx.quiz?.quiz_id },
      isServer: false,
    });
    setDisabled(false);
  }

  const isPossibleQuiz =
    ctx.quiz?.status === EN_QUIZ_STATUS.QUIZ || ctx.quiz?.status === EN_QUIZ_STATUS.COUNTDOWN;
  const isDisabledSelect = !isPossibleQuiz || isFinishCount || !ctx.user?.alive;

  const renderFromStatus = () => {
    switch (ctx.quiz?.status) {
      case EN_QUIZ_STATUS.CALCULATE:
        return <Calculate />;
      case EN_QUIZ_STATUS.SHOW_RESULT:
        if (!ctx.user?.alive && ctx.user?.currentQuizID !== ctx.quiz.quiz_id) {
          return null;
        }

        return (
          <ShowResult
            isResult={ctx.user?.select === ctx.quiz?.quiz_correct_answer}
            result={
              (ctx.quiz?.quiz_selector &&
                ctx.quiz?.quiz_selector[(ctx.quiz?.quiz_correct_answer || 0) - 1]?.title) ||
              ''
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <section className={clsx(styles.container, !isPossibleQuiz && styles.hidden)}>
      <Countdown
        className={styles.countdown}
        active={ctx.quiz?.status === EN_QUIZ_STATUS.COUNTDOWN && !isFinishCount}
        quizTime={displayCount}
      />
      <div className={styles.quizWrap}>
        <h1 className={styles.question}>{ctx.quiz?.quiz_desc}</h1>
        {ctx.quiz?.quiz_type === EN_QUIZ_TYPE.IMAGE && (
          <img className={styles.img} src={ctx.quiz?.quiz_image_url} alt="" />
        )}
        <article className={styles.selectorBox}>
          {ctx.quiz?.quiz_selector?.map((selector) => (
            <Selector
              key={selector.no}
              selector={selector}
              selectedNo={selectedNo}
              isShowResult={ctx.quiz?.status === EN_QUIZ_STATUS.SHOW_RESULT}
              isDisabled={isDisabledSelect || disabled}
              result={ctx.quiz?.quiz_correct_answer || -1}
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
