import { useEffect, useState } from 'react';

import FirebaseAuthClient from '../../../models/commons/firebase_auth_client.model';

/** quiz 정보 조회 */
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

/** 참가자 정보 조회(상태 등) */
export const useParticipantStoreDoc = ({
  collectionPath,
  docPath,
  uid,
}: {
  collectionPath: string;
  docPath: string;
  uid: string;
}) => {
  const [data, updateDoc] = useState<{
    docRef: firebase.firestore.DocumentReference;
    docValue?: firebase.firestore.DocumentSnapshot;
  }>(() => {
    const doc = FirebaseAuthClient.getInstance()
      .FireStore.collection(collectionPath)
      .doc(docPath)
      .collection('participants')
      .doc(uid);
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
