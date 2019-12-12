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
    transform: `translate3d(0, ${active ? '0' : '-100%'}, 0)`,
  });

  return (
    <animated.aside className={clsx(styles.countdown, className)} style={containerStyle}>
      <animated.div className={styles.meter} style={gaugeStyle} />
      <span>COUNTDOWN! {Math.max(0, quizTime)}</span>
    </animated.aside>
  );
};

export default Countdown;
