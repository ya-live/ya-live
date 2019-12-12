import { NextApiRequest, NextApiResponse } from 'next';

import quizController from '../../../../controllers/quiz.controller';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  if (method === 'POST') {
    await quizController.reviveCurrentRoundParticipants({ query, res });
  }

  res.status(404).end();
}
