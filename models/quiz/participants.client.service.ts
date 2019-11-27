import { requester } from '../../services/requester';
import { getBaseUrl } from '../commons/utils/get_baseurl';
import { QuizParticipant } from './interface/I_quiz_participant';

export async function findParticipantsForClient(args: {
  uid: string;
  quiz_id: string;
  isServer: boolean;
}) {
  const { isServer } = args;
  const hostAndPort: string = getBaseUrl(isServer);
  const url = `${hostAndPort}/api/quiz/${args.quiz_id}/participants/${args.uid}`;
  try {
    const resp = await requester<QuizParticipant | null>({
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
