import { useEffect, useState, createContext, useContext } from 'react';

import FirebaseAuthClient from '../../../models/commons/firebase_auth_client.model';

interface UserContext {
  user: firebase.User | null;
}

export const userContext = createContext<UserContext>({
  user: null,
});

export const useSession = () => {
  const { user } = useContext(userContext);
  return user;
};

export const useAuth = () => {
  const [state, setState] = useState(() => {
    const user = FirebaseAuthClient.getInstance().Auth.currentUser;
    return {
      initializing: true,
      haveUser: !!user,
      user,
    };
  });

  function onChange(user: firebase.User | null) {
    console.log('onChange');
    setState({ initializing: false, haveUser: !!user, user });
  }

  useEffect(() => {
    console.log('useEffect');
    // listen for auth state changes
    const unsubscribe = FirebaseAuthClient.getInstance().Auth.onAuthStateChanged(onChange);

    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, []);

  return state;
};
