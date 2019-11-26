import debug from 'debug';
import { NextApiRequest, NextApiResponse } from 'next';

import memberController from '../../../controllers/member.controller';

const log = debug('tjl:api:members:index');

/** 멤버 root */
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line no-console
  const { method } = req;
  log(method);
  if (method !== 'POST') {
    res.status(404).end();
  }
  if (method === 'POST') {
    await memberController.add({ headers: req.headers, body: req.body, res });
  }
}
