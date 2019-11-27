import debug from 'debug';
import { NextApiRequest, NextApiResponse } from 'next';

import participantsModel from '../models/quiz/participants.model';
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

export default { findParticipant };
