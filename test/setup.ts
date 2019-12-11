import FirebaseAdmin from '@/models/commons/firebase_admin.model';
import { resetQuiz } from './internal/reset_quiz';
import { spawnInfantry } from './internal/spawn_infantry';

const db = FirebaseAdmin.getInstance().Firestore;

const setup = async () => {
  const testDoc = await db
    .collection('quiz')
    .doc('siege_test')
    .get();

  await resetQuiz(testDoc);
  await spawnInfantry(testDoc);
};

setup();
