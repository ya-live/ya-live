import React, { useContext, useState, useEffect } from 'react';
import { QuizOperation } from '../../../models/quiz/interface/I_quiz_operation';
import { EN_QUIZ_TYPE } from '../../../models/quiz/interface/EN_QUIZ_TYPE';
import styles from './quiz.css';
import { updateParticipantsForClient } from '../../../models/quiz/participants.client.service';
import { QuizClientContext } from '../../../context/quiz/client/QuizClientContext';
import Selector from './quiz/selector';
import { QuizParticipant } from '../../../models/quiz/interface/I_quiz_participant';
import { EN_QUIZ_STATUS } from '../../../models/quiz/interface/EN_QUIZ_STATUS';

interface QuizProps {
  quiz: QuizOperation;
  user: QuizParticipant;
}

const Quiz: React.FC<QuizProps> = ({ quiz, user }) => {
  const ctx = useContext(QuizClientContext);
  const [isFinishCount, setIsFinishCount] = useState(false);
  const [displayCount, setDisplayCount] = useState('');

  useEffect(() => {
    if (quiz.status === EN_QUIZ_STATUS.COUNTDOWN) {
      startCountdown();
    }
  }, [quiz.status]);

  function startCountdown() {
    let countdown = 10;
    const count = setInterval(() => {
      if (countdown === 0) {
        setDisplayCount('Time over');
        setIsFinishCount(true);
        clearInterval(count);

        return;
      }

      setDisplayCount(String(countdown));
      countdown -= 1;
    }, 1000);
  }

  function select(no: number) {
    if (no === user.select) {
      return;
    }

    updateParticipantsForClient({
      uid: ctx.userID,
      quiz_id: ctx.quizID,
      info: { select: no },
      isServer: false,
    });
  }

  return (
    <section className={styles.container}>
      <div className={styles.quizWrap}>
        <h1 className={styles.question}>{quiz.quiz_desc}</h1>
        {quiz.quiz_type === EN_QUIZ_TYPE.IMAGE && <img src={quiz.quiz_image_url} alt="" />}
        <article className={styles.selectorBox}>
          {quiz.quiz_selector?.map((selector) => (
            <Selector
              key={selector.no}
              selector={selector}
              selectedNo={user.select || -1}
              isShowResult={quiz.status === EN_QUIZ_STATUS.SHOW_RESULT || isFinishCount}
              result={quiz.quiz_correct_answer || -1}
              onClick={() => select(selector.no)}
            />
          ))}
        </article>
      </div>
      {quiz.status === EN_QUIZ_STATUS.COUNTDOWN && (
        <div className={styles.countdownBox}>
          {displayCount}
          <span role="img" aria-label="clock">
            ⏰
          </span>
        </div>
      )}
    </section>
  );
};

export default Quiz;
