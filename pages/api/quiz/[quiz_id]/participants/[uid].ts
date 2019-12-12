import debug from 'debug';
import { NextApiRequest, NextApiResponse } from 'next';

import quizController from '../../../../../controllers/quiz.controller';

const log = debug('tjl:api:quiz:participants');

/** quiz/participant root */
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line no-console
  const { method, query, body } = req;
  log(method);
  if (!(method === 'GET' || method === 'PUT' || method === 'POST')) {
    res.status(404).end();
  }
  if (method === 'GET') {
    await quizController.findParticipant({ query, res });
  }
  if (method === 'PUT') {
    await quizController.updateParticipant({ query, res, body });
  }
  if (method === 'POST') {
    await quizController.joinParticipant({ query, res, body });
  }
}
