import React from 'react';

import FirebaseAuthClient from '../../models/commons/firebase_auth_client.model';

interface ILoginCompleteProps {
  displayName?: string | null;
  email?: string | null;
}

async function onClickSignOut() {
  await FirebaseAuthClient.getInstance().Auth.signOut();
}

const LoginComplete: React.FC<ILoginCompleteProps> = ({ displayName, email }) => {
  const [name] = (displayName || '').split('_');

  return (
    <section>
      <div>{name}님,</div>
      <div>{email} 계정으로 참가하셨습니다.</div>
      <div>
        계정을 변경하시려면{' '}
        <button type="button" onClick={onClickSignOut}>
          여기
        </button>
        를 클릭해주세요.
      </div>
    </section>
  );
};

export default LoginComplete;
