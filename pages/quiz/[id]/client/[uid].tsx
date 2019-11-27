import debug from 'debug';
import { NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';

import { useAuth } from '../../../../components/auth/hooks/auth_hooks';
import {
  useStoreDoc,
  useParticipantStoreDoc,
} from '../../../../components/auth/hooks/firestore_hooks';
import SlLayout from '../../../../components/layout';
import QuizDisplay from '../../../../components/quiz/display';
import QuizStatus from '../../../../components/quiz/status';
import getStringValueFromQuery from '../../../../controllers/etc/get_value_from_query';
import { EN_QUIZ_STATUS } from '../../../../models/quiz/interface/EN_QUIZ_STATUS';
import { QuizOperation } from '../../../../models/quiz/interface/I_quiz_operation';
import { QuizParticipant } from '../../../../models/quiz/interface/I_quiz_participant';
import {
  findParticipantsForClient,
  updateParticipantsForClient,
} from '../../../../models/quiz/participants.client.service';

const log = debug('tjl:page:quiz-client');

interface Props {
  query: ParsedUrlQuery;
  /** 퀴즈 id */
  id: string;
  /** 사용자 고유 아이디 */
  uid: string;
  /** 참가자 정보 */
  participantInfo?: QuizParticipant;
}

const initData: QuizOperation = {
  status: EN_QUIZ_STATUS.INIT,
  title: '데이터 수신 중',
  total_participants: 0,
  alive_participants: 0,
};
const defaultParticipantData: QuizParticipant = { join: '2019-11-27T09:00:00+09:00', alive: false };

/** 개별 클라이언트(실제 참여자 사용) */
const QuizClient: NextPage<Props> = ({ id, uid, participantInfo }) => {
  const { docValue: info } = useStoreDoc({ collectionPath: 'quiz', docPath: id });
  const { docValue: participantInfoFromLive } = useParticipantStoreDoc({
    uid,
    collectionPath: 'quiz',
    docPath: id,
  });
  const { initializing, haveUser, user } = useAuth();
  const operationInfo: QuizOperation = (() => {
    if (info === undefined) {
      return initData;
    }
    const dataFromFireStore = info.data();
    if (dataFromFireStore) {
      return dataFromFireStore as QuizOperation;
    }
    return initData;
  })();
  const useParticipantInfo = (() => {
    if (participantInfo && participantInfoFromLive === undefined) {
      return participantInfo;
    }
    if (participantInfoFromLive) {
      const data = participantInfoFromLive.data();
      return data as QuizParticipant;
    }
    return defaultParticipantData;
  })();

  const { printTitle, letItGo } = (() => {
    if (initializing) {
      return { printTitle: '데이터 확인중', letItGo: false };
    }
    if (participantInfo === undefined) {
      return { printTitle: '참가자가 아닙니다. 빠염', letItGo: false };
    }
    // 로그인 된 사용자인데 uid와 auth.uid가 다른 경우(타 사용자의 client로 접속한 경우)
    if (haveUser && user && user.uid !== uid) {
      return { printTitle: '정상적인 접근이 아닙니다. 빠염', letItGo: false };
    }

    if (participantInfoFromLive === undefined) {
      return { printTitle: '참가 정보 확인 수신 중', letItGo: false };
    }
    return { printTitle: '', letItGo: true };
  })();
  console.log(letItGo);
  const status = QuizStatus({ status: operationInfo.status, title: operationInfo.title });
  const quizInfo = QuizDisplay({
    possiblePlayer: useParticipantInfo.alive,
    status: operationInfo.status,
    info: operationInfo,
    handleClick: async ({ no, quiz_id }) => {
      log({ no, quiz_id });
      console.log({ no, quiz_id });
      await updateParticipantsForClient({
        uid,
        quiz_id: id,
        info: { currentQuizID: quiz_id, select: no },
        isServer: false,
      });
    },
  });
  return (
    <SlLayout>
      {printTitle}
      {letItGo ? (
        <>
          {status}
          {quizInfo}
        </>
      ) : null}
    </SlLayout>
  );
};

QuizClient.getInitialProps = async (ctx) => {
  const id = getStringValueFromQuery({ query: ctx.query, field: 'id' });
  const uid = getStringValueFromQuery({ query: ctx.query, field: 'uid' });
  const useQID = id || 'none';
  const useUID = uid || 'none';
  let info: QuizParticipant | undefined;
  if (useQID !== 'none' && useUID !== 'none') {
    const resp = await findParticipantsForClient({ uid: useUID, quiz_id: useQID, isServer: true });
    if (resp.status === 200 && resp.payload) {
      info = resp.payload;
    }
  }
  return {
    id: useQID,
    uid: useUID,
    query: ctx.query,
    participantInfo: info,
  };
};

export default QuizClient;
