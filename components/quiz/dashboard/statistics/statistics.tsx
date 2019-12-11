import React, { useContext, useRef, useEffect, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import styles from './statistics.css';
import { QuizContext } from '@/context/quiz/dashboard/QuizContext';

interface StatisticsProps {
  active: boolean;
}

const Statistics: React.FC<StatisticsProps> = ({ active }) => {
  const { quiz } = useContext(QuizContext);
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

  return (
    <animated.section className={styles.container} style={containerStyle}>
      <div>
        <h1 className={styles.heading}>생존자</h1>
        <div className={styles.counts}>
          <animated.p className={styles.survivorCount}>
            {survivorCountAnimated.value.interpolate((x) => Math.round(x))}
          </animated.p>
          <p className={deathCount > 0 ? styles.deathCount : styles.revivalCount}>
            {deathCount > 0 ? '-' : '+'}
            {Math.abs(deathCount)}
          </p>
        </div>
      </div>
    </animated.section>
  );
};

export default Statistics;
