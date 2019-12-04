import { requester } from '../../services/requester';
import { getBaseUrl } from '../commons/utils/get_baseurl';
import { QuizOperation, QuizItem } from './interface/I_quiz_operation';

export async function updateQuizOpsForClient(args: {
  quiz_id: string;
  info: Partial<QuizOperation>;
  isServer: boolean;
}) {
  const { isServer } = args;
  const hostAndPort: string = getBaseUrl(isServer);
  const url = `${hostAndPort}/api/quiz/${args.quiz_id}`;
  try {
    const resp = await requester<QuizOperation | null>({
      option: {
        url,
        method: 'put',
        data: args.info,
      },
    });
    return resp;
  } catch (err) {
    return {
      status: 500,
    };
  }
}

/** 각 퀴즈 이벤트의 퀴즈 은행에서 문제를 로딩한다 */
export async function findAllQuizFromBankForClient(args: { quiz_id: string; isServer: boolean }) {
  const { isServer } = args;
  const hostAndPort: string = getBaseUrl(isServer);
  const url = `${hostAndPort}/api/quiz/${args.quiz_id}/quiz`;
  try {
    const resp = await requester<QuizItem[] | null>({
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
