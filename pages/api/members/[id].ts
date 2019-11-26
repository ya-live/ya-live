import { NextApiRequest, NextApiResponse } from 'next';

import memberController from '../../../controllers/member.controller';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  await memberController.find({ query: req.query, res });
}
