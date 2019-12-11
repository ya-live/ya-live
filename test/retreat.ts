import FirebaseAdmin from '@/models/commons/firebase_admin.model';
import { QuizOperation } from '@/models/quiz/interface/I_quiz_operation';
import { QuizParticipant } from '@/models/quiz/interface/I_quiz_participant';

const db = FirebaseAdmin.getInstance().Firestore;

const countCasualties = (
  batch: FirebaseFirestore.WriteBatch,
  doc: FirebaseFirestore.DocumentSnapshot,
  answer: number,
): number => {
  if ((doc.data() as QuizParticipant).select !== answer) {
    batch.update(doc.ref, 'alive', false);
    return 1;
  }

  return 0;
};

const retreat = async () => {
  let batch = db.batch();
  const commits = [];

  const testDoc = await db
    .collection('quiz')
    .doc('siege_test')
    .get();
  const testQuiz = testDoc.data() as QuizOperation;
  const answer = testQuiz.quiz_correct_answer!;

  const participants = await testDoc.ref
    .collection('participants')
    .where('alive', '==', true)
    .get();

  let index = 0;
  let deathCount = 0;
  participants.forEach((doc) => {
    if (index === 400) {
      commits.push(batch.commit());
      batch = db.batch();
    }

    deathCount += countCasualties(batch, doc, answer);
    index += 1;
  });

  batch.update(testDoc.ref, 'alive_participants', testQuiz.alive_participants - deathCount);

  commits.push(batch.commit());

  await Promise.all(commits);
};

retreat();
