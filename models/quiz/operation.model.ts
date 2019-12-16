import FirebaseAdmin from '../commons/firebase_admin.model';
import { QuizOperation, QuizItem } from './interface/I_quiz_operation';

async function findOperationInfo(args: { quiz_id: string }) {
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
    return oldData;
  } catch (err) {
    return null;
  }
}

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

async function initTotalParticipants(args: { quiz_id: string }) {
  const ref = FirebaseAdmin.getInstance()
    .Firestore.collection('quiz')
    .doc(args.quiz_id);
  try {
    const infoSnap = await ref.get();
    // 정보가 존재하지 않으면 null 반환
    if (infoSnap.exists === false) {
      return null;
    }

    const info = infoSnap.data() as QuizOperation;

    const participants = await FirebaseAdmin.getInstance()
      .Firestore.collection('quiz')
      .doc(args.quiz_id)
      .collection('participants')
      .get();
    await ref.update({
      total_participants: participants.size,
      alive_participants: participants.size,
    });
    const updateData = {
      ...info,
      total_participants: participants.size,
      alive_participants: participants.size,
    };
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

async function saveDeadStatus({ festivalId }: { festivalId: string }) {
  try {
    const festivalSnap = await FirebaseAdmin.getInstance()
      .Firestore.collection('quiz')
      .doc(festivalId)
      .get();
    const festivalData = festivalSnap.data() as QuizOperation;

    const currnetRoundParticipantsSnap = await festivalSnap.ref
      .collection('participants')
      .where('alive', '==', true)
      .where('currentQuizID', '==', festivalData.quiz_id)
      .get();

    const deadParticipants = currnetRoundParticipantsSnap.docs.filter(
      (participant) => participant.data().select !== festivalData.quiz_correct_answer,
    );

    // alive=false 처리
    const deadReqeusts = deadParticipants.map((deadParticipant) =>
      deadParticipant.ref.update({ alive: false }),
    );
    await Promise.all(deadReqeusts);

    // quiz에 alive_participants 업데이트
    const aliveParticipantCount =
      currnetRoundParticipantsSnap.docs.length - deadParticipants.length;
    await festivalSnap.ref.update({ alive_participants: aliveParticipantCount });

    return { ...festivalData, alive_participants: aliveParticipantCount };
  } catch (err) {
    return null;
  }
}

async function reviveCurrentRoundParticipants({ festivalId }: { festivalId: string }) {
  try {
    const festivalSnap = await FirebaseAdmin.getInstance()
      .Firestore.collection('quiz')
      .doc(festivalId)
      .get();
    const festivalData = festivalSnap.data() as QuizOperation;

    const currentRoundParticipantsSnap = await festivalSnap.ref
      .collection('participants')
      .where('currentQuizID', '==', festivalData.quiz_id)
      .get();

    const reviveReqeusts = currentRoundParticipantsSnap.docs
      .filter((participant) => participant.data().alive === false)
      .map((deadParticipant) => deadParticipant.ref.update({ alive: true }));
    await Promise.all(reviveReqeusts);

    // quiz의 alive_participants 업데이트
    const aliveParticipantCount = currentRoundParticipantsSnap.docs.length;
    await festivalSnap.ref.update({ alive_participants: aliveParticipantCount });

    return { ...festivalData, alive_participants: aliveParticipantCount };
  } catch (err) {
    return null;
  }
}

async function initAliveParticipants({
  festivalId,
  currentQuizID,
}: {
  festivalId: string;
  currentQuizID: string;
}) {
  try {
    const festivalSnap = await FirebaseAdmin.getInstance()
      .Firestore.collection('quiz')
      .doc(festivalId)
      .get();

    const aliveUsers = await festivalSnap.ref
      .collection('participants')
      .where('alive', '==', true)
      .get();

    const reviveReqeusts = aliveUsers.docs.map((deadParticipant) =>
      deadParticipant.ref.update({ currentQuizID, select: -1 }),
    );
    await Promise.all(reviveReqeusts);

    return true;
  } catch (err) {
    return false;
  }
}

export default {
  findOperationInfo,
  initTotalParticipants,
  updateOperationInfo,
  getAllQuizFromBank,
  saveDeadStatus,
  reviveCurrentRoundParticipants,
  initAliveParticipants,
};
