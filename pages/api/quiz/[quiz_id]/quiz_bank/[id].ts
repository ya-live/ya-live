import { NextApiRequest, NextApiResponse } from 'next';

import quizController from '../../../../../controllers/quiz.controller';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line no-console
  const { method, query, body } = req;

  if (method === 'PUT') {
    await quizController.updateQuiz({ query, res, body });
  }

  res.status(404).end();
}
