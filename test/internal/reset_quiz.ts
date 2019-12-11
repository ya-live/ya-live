import FirebaseAdmin from '@/models/commons/firebase_admin.model';

const db = FirebaseAdmin.getInstance().Firestore;

const dropCollection = async (
  collectionRef: FirebaseFirestore.CollectionReference,
): Promise<void> => {
  const collection = await collectionRef.get();

  let batch = db.batch();
  const commits = [];

  collection.docs.forEach((doc, index) => {
    if (index === 400) {
      commits.push(batch.commit());
      batch = db.batch();
    }
    batch.delete(doc.ref);
  });

  commits.push(batch.commit());

  await Promise.all(commits);
};

export const resetQuiz = async (
  quizSnapshot: FirebaseFirestore.DocumentSnapshot,
): Promise<void> => {
  if (quizSnapshot.exists) {
    await Promise.all([
      dropCollection(quizSnapshot.ref.collection('participants')),
      dropCollection(quizSnapshot.ref.collection('quiz_bank')),
    ]);
    await quizSnapshot.ref.update('status', 'PREPARE');
    return;
  }

  await quizSnapshot.ref.set({
    alive_participants: 100,
    quiz_correct_answer: 4,
    quiz_desc: '"구첩반상"에서 구첩은 몇 개의 반찬을 의미할까요?',
    quiz_id: 'q01',
    quiz_selector: [
      {
        no: 1,
        title: 'Electric Shock Will Roll',
      },
      {
        no: 2,
        title: '전국 Handclap 자랑',
      },
      {
        no: 3,
        title: '소년점프해 빠졌어',
      },
      {
        no: 4,
        title: '하루도 Spectre를 내가 저지르지 않은 적이 없었다',
      },
    ],
    quiz_type: 'TEXT',
    status: 'PREPARE',
    title: 'siege test',
    total_participants: 100,
  });
};
