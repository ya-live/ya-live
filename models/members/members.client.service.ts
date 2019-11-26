import { requester } from '../../services/requester';
import { getBaseUrl } from '../commons/utils/get_baseurl';
import { MemberInfo } from './interfaces/memberInfo';

export async function memberFind(args: { member_id: string; isServer: boolean }) {
  const { isServer } = args;
  const hostAndPort: string = getBaseUrl(isServer);
  const url = `${hostAndPort}/api/members/${args.member_id}`;
  try {
    const resp = await requester<MemberInfo | null>({
      option: {
        url,
        method: 'get',
      },
    });
    return resp;
  } catch (err) {
    return {
      status: 500,
    };
  }
}

export async function memberAdd(args: { data: MemberInfo; token: string; isServer: boolean }) {
  const { isServer } = args;
  const hostAndPort: string = getBaseUrl(isServer);
  const url = `${hostAndPort}/api/members`;
  try {
    const resp = await requester<MemberInfo | null>({
      option: {
        url,
        method: 'post',
        data: args.data,
        headers: { authorization: args.token },
      },
    });
    return resp;
  } catch (err) {
    return {
      status: 500,
    };
  }
}
