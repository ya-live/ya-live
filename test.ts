import * as fs from 'fs';

import FirebaseAdmin from './models/commons/firebase_admin.model';

const text = fs.readFileSync('./quiz_convert.json', 'utf8');
const parsed = JSON.parse(text) as any[];

const collectionRef = FirebaseAdmin.getInstance()
  .Firestore.collection('quiz')
  .doc('circusmas')
  .collection('quiz_bank');

(async () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const data of parsed) {
    // eslint-disable-next-line no-await-in-loop
    await collectionRef.add(data);
  }
})();
