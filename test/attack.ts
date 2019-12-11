import FirebaseAdmin from '@/models/commons/firebase_admin.model';

const db = FirebaseAdmin.getInstance().Firestore;

const random4 = () => Math.round(Math.random() * 3 + 1);

const fireTarget = (
  batch: FirebaseFirestore.WriteBatch,
  doc: FirebaseFirestore.DocumentSnapshot,
): void => {
  batch.update(doc.ref, 'select', random4());
};

const attack = async () => {
  let batch = db.batch();
  const commits = [];

  const testDocRef = db.collection('quiz').doc('siege_test');
  const participants = await testDocRef
    .collection('participants')
    .where('alive', '==', true)
    .get();

  let index = 0;
  participants.forEach((doc) => {
    if (index === 400) {
      commits.push(batch.commit());
      batch = db.batch();
    }

    fireTarget(batch, doc);
    index += 1;
  });

  commits.push(batch.commit());

  await Promise.all(commits);
};

attack();
