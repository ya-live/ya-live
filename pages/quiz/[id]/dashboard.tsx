import { NextPage } from 'next';
import React from 'react';
import Head from 'next/head';
import { useStoreDoc } from '@/components/auth/hooks/firestore_hooks';
import { QuizOperation } from '@/models/quiz/interface/I_quiz_operation';
import getStringValueFromQuery from '@/controllers/etc/get_value_from_query';
import { QuizContext } from '@/context/quiz/dashboard/QuizContext';
import QuizBody from '@/components/quiz/dashboard/quiz_body';

interface QuizDashboardProps {
  /** 퀴즈 id */
  id?: string;
}

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

  if (!id || !quiz) {
    return null;
  }

  return (
    <QuizContext.Provider value={{ id, quiz }}>
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
