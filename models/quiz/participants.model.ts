import FirebaseAdmin from '../commons/firebase_admin.model';
import { QuizOperation } from './interface/I_quiz_operation';
import { QuizParticipant } from './interface/I_quiz_participant';
import { EN_QUIZ_STATUS } from './interface/EN_QUIZ_STATUS';

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

async function updateParticipant(args: {
  user_id: string;
  quiz_id: string;
  info: Partial<QuizParticipant>;
}) {
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
    const oldData = userInfoSnap.data() as QuizParticipant;
    // 생존한 상태인지 확인
    if (oldData.alive === false) {
      return null;
    }
    const updateData = { ...oldData, ...args.info };
    await ref.doc(args.user_id).set(updateData);
    return updateData;
  } catch (err) {
    return null;
  }
}

async function joinParticipant(args: { user_id: string; quiz_id: string; info: QuizParticipant }) {
  const ref = FirebaseAdmin.getInstance()
    .Firestore.collection('quiz')
    .doc(args.quiz_id);
  try {
    const quizInfoSnap = await ref.get();
    // 정보가 존재하지 않으면 null 반환
    if (quizInfoSnap.exists === false) {
      return null;
    }
    const data = quizInfoSnap.data() as QuizOperation;
    // 퀴즈 상태가 prepare가 아니면 진입할 수 없음
    if (data.status !== EN_QUIZ_STATUS.PREPARE) {
      return null;
    }
    await FirebaseAdmin.getInstance()
      .Firestore.collection('quiz')
      .doc(args.quiz_id)
      .collection('participants')
      .doc(args.user_id)
      .set(args.info);
    return args.info;
  } catch (err) {
    return null;
  }
}

export default { participantFind, updateParticipant, joinParticipant };
