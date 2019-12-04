import FirebaseAdmin from '../commons/firebase_admin.model';
import { QuizOperation, QuizItem } from './interface/I_quiz_operation';

async function updateOperationInfo(args: { quiz_id: string; info: Partial<QuizOperation> }) {
  const ref = FirebaseAdmin.getInstance()
    .Firestore.collection('quiz')
    .doc(args.quiz_id);
  try {
    const infoSnap = await ref.get();
    // 정보가 존재하지 않으면 null 반환
    if (infoSnap.exists === false) {
      return null;
    }
    const oldData = infoSnap.data() as QuizOperation;
    const updateData = { ...oldData, ...args.info };
    await ref.set(updateData);
    return updateData;
  } catch (err) {
    return null;
  }
}

async function getAllQuizFromBank(args: { quiz_id: string }) {
  const ref = FirebaseAdmin.getInstance()
    .Firestore.collection('quiz')
    .doc(args.quiz_id)
    .collection('quiz_bank');
  try {
    const infoSnap = await ref.get();
    const data = infoSnap.docs.map((doc) => doc.data() as QuizItem);

    return data;
  } catch (err) {
    return null;
  }
}

export default { updateOperationInfo, getAllQuizFromBank };
