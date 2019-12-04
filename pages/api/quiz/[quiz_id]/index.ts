import debug from 'debug';
import { NextApiRequest, NextApiResponse } from 'next';

import quizController from '../../../../controllers/quiz.controller';

const log = debug('tjl:api:quiz:index');

/** quiz root */
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line no-console
  const { method, query, body } = req;
  log(method);
  if (!(method === 'PUT')) {
    res.status(404).end();
  }
  if (method === 'PUT') {
    await quizController.updateOperationInfo({ query, res, body });
  }
}
