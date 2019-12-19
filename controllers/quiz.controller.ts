import debug from 'debug';
import { NextApiRequest, NextApiResponse } from 'next';

import participantsModel from '../models/quiz/participants.model';
import quizOpsModel from '../models/quiz/operation.model';
import { QuizParticipant } from '../models/quiz/interface/I_quiz_participant';
import { QuizOperation, QuizItem } from '../models/quiz/interface/I_quiz_operation';
import getStringValueFromQuery from './etc/get_value_from_query';
import validateParamWithData from '../models/commons/req_validator';
import JSCQuizOperation from '../models/quiz/jsc/quiz.operation.jsc';
import memberModel from '../models/members/members.model';

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

async function initTotalParticipants({
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
  const resp = await quizOpsModel.initTotalParticipants({
    quiz_id: quizId,
  });
  log(resp);
  if (!!resp === false) {
    return res.status(404).end();
  }
  return res.json(resp);
}

async function joinParticipant({
  query,
  body,
  res,
}: {
  query: NextApiRequest['query'];
  body: QuizParticipant;
  res: NextApiResponse;
}) {
  const userId = getStringValueFromQuery({ query, field: 'uid' });
  const quizId = getStringValueFromQuery({ query, field: 'quiz_id' });
  log({ userId, quizId, body });
  if (!userId || !quizId || !body) {
    return res.status(400).end();
  }
  // 퀴즈 정보 조회
  const quizInfo = await quizOpsModel.findOperationInfo({ quiz_id: quizId });
  if (quizInfo === null) {
    return res.status(404).end();
  }
  if (quizInfo.possibleEmailAddress) {
    const userInfo = await memberModel.memberFind({ user_id: userId });
    if (userInfo === null || userInfo.email === undefined) {
      return res.status(404).end();
    }
    const emailDomain = userInfo.email.split('@');
    if (emailDomain[1] !== quizInfo.possibleEmailAddress) {
      return res.status(401).end();
    }
  }
  // db 조회
  const resp = await participantsModel.joinParticipant({
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

async function updateQuiz({
  query,
  body,
  res,
}: {
  query: NextApiRequest['query'];
  body: Partial<QuizItem>;
  res: NextApiResponse;
}) {
  const festivalId = getStringValueFromQuery({ query, field: 'quiz_id' });
  const quizId = getStringValueFromQuery({ query, field: 'id' });

  if (!festivalId || !quizId) {
    return res.status(400).end();
  }

  const resp = await quizOpsModel.updateQuiz({
    festivalId,
    quizId,
    quiz: body,
  });
  log('[updateQuiz]: ', resp);
  if (resp === null) {
    return res.status(500).end();
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

/** 부활하기 - 많은 참가자가 죽었을 때, 참가자 모두 부활 */
async function reviveAllParticipants({
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

  const resp = await quizOpsModel.reviveAllParticipants({ festivalId: data.id });
  log('[revive all]: ', resp);
  if (resp === null) {
    return res.status(500).end();
  }
  return res.json(resp);
}

/** 생존자의 선택 번호와 퀴즈번호를 설정한다. */
async function initAliveUser({
  query,
  res,
}: {
  query: NextApiRequest['query'];
  res: NextApiResponse;
}) {
  const festivalId = getStringValueFromQuery({ query, field: 'quiz_id' });
  const currentQuizID = getStringValueFromQuery({ query, field: 'current_quiz_id' });
  if (festivalId === undefined || currentQuizID === undefined) {
    return res.status(400).end();
  }

  const resp = await quizOpsModel.initAliveParticipants({ festivalId, currentQuizID });
  log('[initAliveUser]: ', resp);
  if (resp === null) {
    return res.status(500).end();
  }
  return res.end();
}

export default {
  initTotalParticipants,
  findParticipant,
  joinParticipant,
  updateParticipant,
  updateOperationInfo,
  findAllQuizFromBank,
  updateQuiz,
  calculateRound,
  reviveCurrentRoundParticipants,
  reviveAllParticipants,
  initAliveUser,
};
