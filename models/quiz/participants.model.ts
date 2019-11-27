import FirebaseAdmin from '../commons/firebase_admin.model';
import { QuizParticipant } from './interface/I_quiz_participant';

async function participantFind(args: { user_id: string; quiz_id: string }) {
  const ref = FirebaseAdmin.getInstance()
    .Firestore.collection('quiz')
    .doc(args.quiz_id)
    .collection('participants');
  try {
    const userInfoSnap = await ref.doc(args.user_id).get();
    // 정보가 존재하지 않으면 null 반환
    if (userInfoSnap.exists === false) {
      return null;
    }
    return userInfoSnap.data() as QuizParticipant;
  } catch (err) {
    return null;
  }
}

export default { participantFind };
