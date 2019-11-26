import FirebaseAdmin from '../commons/firebase_admin.model';
import { MemberInfo } from './interfaces/memberInfo';

async function memberFind(args: { user_id: string }) {
  const ref = FirebaseAdmin.getInstance().Firestore.collection('members');
  try {
    const userInfoSnap = await ref.doc(args.user_id).get();
    // 정보가 존재하지 않으면 null 반환
    if (userInfoSnap.exists === false) {
      return null;
    }
    return userInfoSnap.data() as MemberInfo;
  } catch (err) {
    return null;
  }
}

async function memberAdd(args: MemberInfo) {
  const ref = FirebaseAdmin.getInstance().Firestore.collection('members');
  try {
    await ref.doc(args.uid).set({
      ...args,
      id: args.uid,
    });
    return args;
  } catch (err) {
    return null;
  }
}

export default { memberFind, memberAdd };
