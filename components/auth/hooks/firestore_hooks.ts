import { useEffect, useState } from 'react';

import FirebaseAuthClient from '../../../models/commons/firebase_auth_client.model';

export const useStoreDoc = ({
  collectionPath,
  docPath,
}: {
  collectionPath: string;
  docPath: string;
}) => {
  const [data, updateDoc] = useState<{
    docRef: firebase.firestore.DocumentReference;
    docValue?: firebase.firestore.DocumentSnapshot;
  }>(() => {
    const doc = FirebaseAuthClient.getInstance()
      .FireStore.collection(collectionPath)
      .doc(docPath);
    return {
      docRef: doc,
    };
  });

  useEffect(() => {
    // listen for auth state changes
    const snapshot = data.docRef.onSnapshot((doc: firebase.firestore.DocumentSnapshot) => {
      updateDoc({
        docRef: data.docRef,
        docValue: doc.exists ? doc : undefined,
      });
    });

    // unsubscribe to the listener when unmounting
    return () => snapshot();
  }, [data.docRef]);

  return data;
};
