import debug from 'debug';
import { NextApiRequest, NextApiResponse } from 'next';

import { IncomingHttpHeaders } from 'http';
import validateParamWithData from '../models/commons/req_validator';
import { MemberInfo } from '../models/members/interfaces/memberInfo';
import JSCMemberAdd from '../models/members/jsc/member.add.jsc';
import JSCMemberFind from '../models/members/jsc/member.find.jsc';
import membersModel from '../models/members/members.model';
import getStringValueFromQuery from './etc/get_value_from_query';
import FirebaseAdmin from '../models/commons/firebase_admin.model';

const log = debug('tjl:controller:members');

/** 멤버 조회 */
async function find({ query, res }: { query: NextApiRequest['query']; res: NextApiResponse }) {
  const userId = getStringValueFromQuery({ query, field: 'id' });
  if (!userId) {
    return res.status(400).end();
  }
  // 요청한 값 확인
  const { result, data } = validateParamWithData<{ id: string }>({ id: userId }, JSCMemberFind);
  if (result === false) {
    return res.status(400).end();
  }
  // db 조회
  const resp = await membersModel.memberFind({ user_id: data.id });
  log(resp);
  if (!!resp === false) {
    return res.status(404).end();
  }
  return res.json(resp);
}

/** 멤버 추가 */
async function add({
  headers,
  body,
  res,
}: {
  headers: IncomingHttpHeaders;
  body: MemberInfo;
  res: NextApiResponse;
}) {
  const token = headers.authorization;
  if (!token) {
    return res.status(400).end();
  }
  try {
    await FirebaseAdmin.getInstance().Auth.verifyIdToken(token);
  } catch (err) {
    return res.status(400).end();
  }

  const { result, data, errorMessage } = validateParamWithData<{
    body: MemberInfo;
  }>({ body }, JSCMemberAdd);
  if (result === false) {
    return res.status(400).end(errorMessage);
  }
  // 이미 사용자가 존재하는지 확인
  const findResp = await membersModel.memberFind({ user_id: data.body.uid });
  if (!!findResp === true) {
    return res.json(findResp);
  }
  log(body);

  // 새로 추가
  const addResp = await membersModel.memberAdd({ ...body });
  if (addResp === null) {
    return res.status(500).end();
  }
  return res.json(addResp);
}

export default { find, add };
