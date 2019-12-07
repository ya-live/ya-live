import { NextApiRequest, NextApiResponse } from 'next';

import quizController from '../../../../controllers/quiz.controller';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  if (method !== 'POST') {
    res.status(404).end();
  }
  await quizController.calculateRound({ query, res });
}
