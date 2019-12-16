import React from 'react';
import { animated, useSpring } from 'react-spring';
import clsx from 'clsx';
import styles from './countdown.css';

interface CountdownProps {
  active?: boolean;
  quizTime: number;
  className?: string;
}

export const COUNTDOWN = 10;

const Countdown: React.FC<CountdownProps> = ({ active, quizTime, className }) => {
  const gaugeStyle = useSpring({
    config: {
      tension: 300,
    },
    transform: `scaleX(${(COUNTDOWN - quizTime) / COUNTDOWN})`,
  });
  const containerStyle = useSpring({
    transform: `translateY(${active ? '0' : '-100%'})`,
  });

  return (
    <animated.div className={clsx(styles.countdown, className)} style={containerStyle}>
      <animated.div className={styles.meter} style={gaugeStyle} />
      <span>COUNTDOWN! {Math.max(0, quizTime)}</span>
    </animated.div>
  );
};

export default Countdown;
