import faker from 'faker';
import FirebaseAdmin from '@/models/commons/firebase_admin.model';

const db = FirebaseAdmin.getInstance().Firestore;

export const spawnInfantry = async (
  quizSnapshot: FirebaseFirestore.DocumentSnapshot,
): Promise<void> => {
  let batch = db.batch();
  const commits = [];

  const now = new Date();

  for (let i = 0; i < 100; i += 1) {
    if (i === 400) {
      commits.push(batch.commit());
      batch = db.batch();
    }

    const ref = quizSnapshot.ref.collection('participants').doc();

    batch.create(ref, {
      alive: true,
      currentQuizID: 'q01',
      id: i,
      displayName: `${faker.name.lastName()}${faker.name.firstName()}_야놀자 R&D그룹 CX서비스실 부서원`,
      join: now,
      select: -1,
    });
  }

  commits.push(batch.commit());

  await Promise.all(commits);
};
