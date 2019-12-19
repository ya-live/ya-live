import { NextPage } from 'next';
import React, { useRef, useEffect } from 'react';
import Head from 'next/head';
import { useStoreDoc } from '@/components/auth/hooks/firestore_hooks';
import { QuizOperation } from '@/models/quiz/interface/I_quiz_operation';
import getStringValueFromQuery from '@/controllers/etc/get_value_from_query';
import { QuizContext, SoundMap } from '@/context/quiz/dashboard/QuizContext';
import QuizBody from '@/components/quiz/dashboard/quiz_body';
import { EN_QUIZ_STATUS } from '@/models/quiz/interface/EN_QUIZ_STATUS';

interface QuizDashboardProps {
  /** 퀴즈 id */
  id?: string;
}

const QuizDashboard: NextPage<QuizDashboardProps> = ({ id }) => {
  const sounds = useRef<SoundMap>(null!);
  const currentSound = useRef<HTMLAudioElement | null>(null);

  const { docValue: info } = useStoreDoc({ collectionPath: 'quiz', docPath: id || 'none' });

  useEffect(() => {
    sounds.current = {
      calculate: new Audio('/sfx/calculate.mp3'),
      countdown: new Audio('/sfx/countdown.mp3'),
      ending: new Audio('/sfx/ending.mp3'),
      golden: new Audio('/sfx/golden.mp3'),
      idle: new Audio('/sfx/idle.mp3'),
      last1: new Audio('/sfx/last1.mp3'),
      last5: new Audio('/sfx/last5.mp3'),
      quiz: new Audio('/sfx/quiz.mp3'),
      result: new Audio('/sfx/result.mp3'),
    };
  }, []);

  const quiz = (() => {
    if (!info) {
      return;
    }

    const dataFromFireStore = info.data();
    if (dataFromFireStore) {
      return dataFromFireStore as QuizOperation;
    }
  })();
  const aliveParticipants = quiz?.alive_participants;
  const status = quiz?.status;

  useEffect(() => {
    if (!status) {
      return;
    }

    if (currentSound.current) {
      currentSound.current.pause();
      currentSound.current = null;
    }

    let soundToPlay: HTMLAudioElement | undefined;

    switch (status) {
      case EN_QUIZ_STATUS.QUIZ:
        soundToPlay = sounds.current.quiz;
        break;
      case EN_QUIZ_STATUS.CALCULATE:
        soundToPlay = sounds.current.calculate;
        break;
      case EN_QUIZ_STATUS.COUNTDOWN:
        soundToPlay = sounds.current.countdown;
        break;
      case EN_QUIZ_STATUS.IDLE:
        if (!aliveParticipants || aliveParticipants > 5) {
          soundToPlay = sounds.current.idle;
          break;
        }
        if (aliveParticipants > 1) {
          soundToPlay = sounds.current.last5;
          break;
        }
        soundToPlay = sounds.current.last1;
        break;
      case EN_QUIZ_STATUS.SHOW_RESULT:
        soundToPlay = sounds.current.result;
        break;
      case EN_QUIZ_STATUS.FINISH:
        soundToPlay = sounds.current.ending;
        break;
      default:
    }

    if (!soundToPlay) {
      return;
    }

    soundToPlay.play();
    currentSound.current = soundToPlay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (!id || !quiz) {
    return null;
  }

  return (
    <QuizContext.Provider
      value={{ id, currentSoundRef: currentSound, sounds: sounds.current, quiz }}
    >
      <Head>
        <title>YaLive Dashboard{quiz?.title && ` - ${quiz.title}`}</title>
      </Head>
      <QuizBody />
    </QuizContext.Provider>
  );
};
QuizDashboard.getInitialProps = async (ctx) => {
  const id = getStringValueFromQuery({ query: ctx.query, field: 'id' });

  return {
    id,
  };
};

export default QuizDashboard;
