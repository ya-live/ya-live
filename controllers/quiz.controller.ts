import debug from 'debug';
import { NextApiRequest, NextApiResponse } from 'next';

import participantsModel from '../models/quiz/participants.model';
import quizOpsModel from '../models/quiz/operation.model';
import { QuizParticipant } from '../models/quiz/interface/I_quiz_participant';
import { QuizOperation } from '../models/quiz/interface/I_quiz_operation';
import getStringValueFromQuery from './etc/get_value_from_query';

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

export default { findParticipant, updateParticipant, updateOperationInfo, findAllQuizFromBank };
