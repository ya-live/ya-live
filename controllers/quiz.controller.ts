import debug from 'debug';
import { NextApiRequest, NextApiResponse } from 'next';

import participantsModel from '../models/quiz/participants.model';
import quizOpsModel from '../models/quiz/operation.model';
import { QuizParticipant } from '../models/quiz/interface/I_quiz_participant';
import { QuizOperation } from '../models/quiz/interface/I_quiz_operation';
import getStringValueFromQuery from './etc/get_value_from_query';
import validateParamWithData from '../models/commons/req_validator';
import JSCQuizOperation from '../models/quiz/jsc/quiz.operation.jsc';

const log = debug('tjl:controller:quiz');

async function findParticipant({
  query,
  res,
}: {
  query: NextApiRequest['query'];
  res: NextApiResponse;
}) {
  const userId = getStringValueFromQuery({ query, field: 'uid' });
  const quizId = getStringValueFromQuery({ query, field: 'quiz_id' });
  if (!userId || !quizId) {
    return res.status(400).end();
  }
  // db 조회
  const resp = await participantsModel.participantFind({ user_id: userId, quiz_id: quizId });
  log(resp);
  if (!!resp === false) {
    return res.status(404).end();
  }
  return res.json(resp);
}

async function updateParticipant({
  query,
  body,
  res,
}: {
  query: NextApiRequest['query'];
  body: Partial<QuizParticipant>;
  res: NextApiResponse;
}) {
  const userId = getStringValueFromQuery({ query, field: 'uid' });
  const quizId = getStringValueFromQuery({ query, field: 'quiz_id' });
  log({ userId, quizId, body });
  if (!userId || !quizId || !body) {
    return res.status(400).end();
  }
  // db 조회

  const resp = await participantsModel.updateParticipant({
    user_id: userId,
    quiz_id: quizId,
    info: body,
  });
  log(resp);
  if (!!resp === false) {
    return res.status(404).end();
  }
  return res.json(resp);
}

async function updateOperationInfo({
  query,
  body,
  res,
}: {
  query: NextApiRequest['query'];
  body: Partial<QuizOperation>;
  res: NextApiResponse;
}) {
  const quizId = getStringValueFromQuery({ query, field: 'quiz_id' });
  log({ quizId, body });
  if (!quizId || !body) {
    return res.status(400).end();
  }
  // db 조회

  const resp = await quizOpsModel.updateOperationInfo({
    quiz_id: quizId,
    info: body,
  });
  log(resp);
  if (!!resp === false) {
    return res.status(404).end();
  }
  return res.json(resp);
}

async function findAllQuizFromBank({
  query,
  res,
}: {
  query: NextApiRequest['query'];
  res: NextApiResponse;
}) {
  const quizId = getStringValueFromQuery({ query, field: 'quiz_id' });
  log({ quizId });
  if (!quizId) {
    return res.status(400).end();
  }
  // db 조회

  const resp = await quizOpsModel.getAllQuizFromBank({
    quiz_id: quizId,
  });
  log(resp);
  if (!!resp === false) {
    return res.status(404).end();
  }
  return res.json(resp);
}

/** 정산하기 */
async function calculateRound({
  query,
  res,
}: {
  query: NextApiRequest['query'];
  res: NextApiResponse;
}) {
  const festivalId = getStringValueFromQuery({ query, field: 'quiz_id' });
  if (festivalId === undefined) {
    return res.status(400).end();
  }

  const { result, data } = validateParamWithData<{ id: string }>(
    { id: festivalId },
    JSCQuizOperation,
  );
  if (!result) {
    return res.status(400).end();
  }

  const resp = await quizOpsModel.saveDeadStatus({ festivalId: data.id });
  log('[calculateRound]: ', resp);
  if (resp === null) {
    return res.status(500).end();
  }
  return res.json(resp);
}

/** 부활하기 - 많은 참가자가 죽었을 때, 현재 라운드 참가자 모두 부활 */
async function reviveCurrentRoundParticipants({
  query,
  res,
}: {
  query: NextApiRequest['query'];
  res: NextApiResponse;
}) {
  const festivalId = getStringValueFromQuery({ query, field: 'quiz_id' });
  if (festivalId === undefined) {
    return res.status(400).end();
  }

  const { result, data } = validateParamWithData<{ id: string }>(
    { id: festivalId },
    JSCQuizOperation,
  );
  if (!result) {
    return res.status(400).end();
  }

  const resp = await quizOpsModel.reviveCurrentRoundParticipants({ festivalId: data.id });
  log('[revive]: ', resp);
  if (resp === null) {
    return res.status(500).end();
  }
  return res.json(resp);
}

export default {
  findParticipant,
  updateParticipant,
  updateOperationInfo,
  findAllQuizFromBank,
  calculateRound,
  reviveCurrentRoundParticipants,
};
