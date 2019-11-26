import { NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';

import { useStoreDoc } from '../../../components/auth/hooks/firestore_hooks';
import SlLayout from '../../../components/layout';
import getStringValueFromQuery from '../../../controllers/etc/get_value_from_query';

interface Props {
  query: ParsedUrlQuery;
  id: string;
}

/** 개별 클라이언트(실제 참여자 사용) */
const QuizClient: NextPage<Props> = ({ id }) => {
  const { docValue } = useStoreDoc({ collectionPath: 'quiz', docPath: id });
  const inStoreData =
    docValue !== undefined ? docValue.data() : { status: 'INIT', title: ' 데이터 수신 중' };
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
