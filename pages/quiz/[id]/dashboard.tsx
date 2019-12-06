import { NextPage } from 'next';
import React from 'react';
import Head from 'next/head';
import { useStoreDoc } from '@/components/auth/hooks/firestore_hooks';
import { QuizOperation } from '@/models/quiz/interface/I_quiz_operation';
import getStringValueFromQuery from '@/controllers/etc/get_value_from_query';
import { EN_QUIZ_STATUS } from '@/models/quiz/interface/EN_QUIZ_STATUS';
import Prepare from '@/components/quiz/dashboard/statebody/prepare';
import Quiz from '@/components/quiz/dashboard/statebody/quiz';
import { QuizContext } from '@/context/quiz/dashboard/QuizContext';

interface QuizDashboardProps {
  /** 퀴즈 id */
  id?: string;
}

const getStatebody = (state: EN_QUIZ_STATUS): JSX.Element => {
  switch (state) {
    case EN_QUIZ_STATUS.QUIZ:
    case EN_QUIZ_STATUS.SHOW_RESULT:
      return <Quiz />;
    default:
      return <Prepare />; // 사실상 수습용 화면
  }
};

const QuizDashboard: NextPage<QuizDashboardProps> = ({ id }) => {
  const { docValue: info } = useStoreDoc({ collectionPath: 'quiz', docPath: id || 'none' });

  const quiz = (() => {
    if (!info) {
      return;
    }

    const dataFromFireStore = info.data();
    if (dataFromFireStore) {
      return dataFromFireStore as QuizOperation;
    }
  })();

  if (!quiz) {
    return null;
  }

  return (
    <QuizContext.Provider value={quiz}>
      <Head>
        <title>YaLive Dashboard{quiz?.title && ` - ${quiz.title}`}</title>
      </Head>
      {getStatebody(quiz.status)}
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
