import React, { useContext, useRef, useEffect, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import styles from './statistics.css';
import { QuizContext } from '@/context/quiz/dashboard/QuizContext';
import FirebaseAuthClient from '@/models/commons/firebase_auth_client.model';
import { QuizParticipant } from '@/models/quiz/interface/I_quiz_participant';

interface StatisticsProps {
  active: boolean;
}

const Statistics: React.FC<StatisticsProps> = ({ active }) => {
  const { id, quiz } = useContext(QuizContext);
  const [survivors, setSurvivors] = useState<QuizParticipant[]>([]);
  const [survivorCount, setSurvivorCount] = useState(quiz.alive_participants);
  const [deathCount, setDeathCount] = useState(0);

  const prevSurvivorCount = useRef(quiz.total_participants);

  const survivorCountAnimated = useSpring({
    config: {
      tension: 75,
      friction: 40,
      clamp: true,
    },
    value: survivorCount,
  });

  const containerStyle = useSpring({
    opacity: active ? 1 : 0,
  });

  useEffect(() => {
    if (!active || prevSurvivorCount.current === quiz.alive_participants) {
      return;
    }

    const difference = prevSurvivorCount.current - quiz.alive_participants;
    setSurvivorCount(quiz.alive_participants);
    setDeathCount(difference);
    prevSurvivorCount.current = quiz.alive_participants;
  }, [active, quiz.alive_participants]);

  useEffect(() => {
    if (quiz.alive_participants > 4) {
      return;
    }

    (async () => {
      const survivorsSS = await FirebaseAuthClient.getInstance()
        .FireStore.collection(`quiz/${id}/participants`)
        .where('alive', '==', true)
        .get();

      setSurvivors(survivorsSS.docs.map((doc) => doc.data() as QuizParticipant));
    })();
  }, [id, quiz.alive_participants]);

  return (
    <animated.section className={styles.container} style={containerStyle}>
      <div>
        <h1 className={styles.heading}>생존자</h1>
        <div className={styles.counts}>
          <animated.p className={styles.survivorCount}>
            {survivorCountAnimated.value.interpolate((x) => Math.round(x))}
          </animated.p>
          {quiz.alive_participants > 4 && (
            <p className={deathCount > 0 ? styles.deathCount : styles.revivalCount}>
              {deathCount > 0 ? '-' : '+'}
              {Math.abs(deathCount)}
            </p>
          )}
          {quiz.alive_participants <= 4 &&
            survivors.map((survivor, index) => (
              <p key={survivor.id || index}>{survivor.displayName.split('_')[0]}</p>
            ))}
        </div>
      </div>
    </animated.section>
  );
};

export default Statistics;
