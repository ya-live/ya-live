import { NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';

import { useStoreDoc } from '../../../components/auth/hooks/firestore_hooks';
import SlLayout from '../../../components/layout';
import getStringValueFromQuery from '../../../controllers/etc/get_value_from_query';
import { EN_QUIZ_STATUS } from '../../../models/quiz/interface/EN_QUIZ_STATUS';
import { QuizOperation } from '../../../models/quiz/interface/I_quiz_operation';

interface Props {
  query: ParsedUrlQuery;
  id: string;
}

const initData: QuizOperation = { status: EN_QUIZ_STATUS.INIT, title: ' 데이터 수신 중' };

/** 개별 클라이언트(실제 참여자 사용) */
const QuizClient: NextPage<Props> = ({ id }) => {
  const { docValue } = useStoreDoc({ collectionPath: 'quiz', docPath: id });
  const inStoreData: QuizOperation = (() => {
    if (docValue === undefined) {
      return initData;
    }
    const dataFromFireStore = docValue.data();
    if (dataFromFireStore) {
      return dataFromFireStore as QuizOperation;
    }
    return initData;
  })();
  return (
    <SlLayout>
      <p>{JSON.stringify(inStoreData)}</p>
    </SlLayout>
  );
};

QuizClient.getInitialProps = async (ctx) => {
  const id = getStringValueFromQuery({ query: ctx.query, field: 'id' });
  return {
    id: id || 'none',
    query: ctx.query,
  };
};

export default QuizClient;
