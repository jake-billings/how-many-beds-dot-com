import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import { Unsubscribe, User as FirebaseUser } from 'firebase';
import { Redirect } from 'react-router-dom';
import { User, UserForUI } from '../types';

type FirebaseContext = {
  loading: boolean;
  isSignedIn: boolean;
  firebaseAuthUser: FirebaseUser | null;
  user: UserForUI | null;
};

const defaultFirebaseContext: FirebaseContext = {
  loading: true,
  isSignedIn: false,
  firebaseAuthUser: null,
  user: null,
};

export const FirebaseAuthContext = React.createContext(defaultFirebaseContext);

type FirebaseAuthProviderProps = {
  children: React.ReactNode;
};

export default function FirebaseAuthProvider(props: FirebaseAuthProviderProps): JSX.Element {
  const [authState, setAuthState] = useState<FirebaseContext>(defaultFirebaseContext);

  let unregisterAuthObserver: Unsubscribe | undefined = undefined;
  let userRef: firebase.database.Reference | null = null;

  useEffect(() => {
    unregisterAuthObserver = firebase.auth().onAuthStateChanged((firebaseAuthUser) => {
      if (firebaseAuthUser && firebaseAuthUser.uid) {
        if (userRef) userRef.off();
        userRef = firebase.database().ref(`users/${firebaseAuthUser.uid}`);

        userRef.update({
          lastSignedIn: new Date(),
          email: firebaseAuthUser.email,
        });

        userRef.on('value', (ref) => {
          const val: User = ref.val() as User;

          const user: UserForUI = {
            id: firebaseAuthUser.uid,
            ...val,
          };

          setAuthState({ ...authState, isSignedIn: !!firebaseAuthUser, loading: false, firebaseAuthUser, user });
        });
      } else {
        setAuthState({ ...authState, isSignedIn: !!firebaseAuthUser, loading: false, firebaseAuthUser });
      }
    });

    return (): void => {
      if (unregisterAuthObserver) unregisterAuthObserver();
      if (userRef) userRef.off();
    };
  }, []);

  return (
    <FirebaseAuthContext.Provider value={authState}>
      {!authState.loading && props.children}
    </FirebaseAuthContext.Provider>
  );
}

export function ProtectedRoute({ children }: { children: JSX.Element }): JSX.Element {
  return (
    <FirebaseAuthContext.Consumer>
      {({ isSignedIn, loading }): JSX.Element => {
        if (loading) {
          return <p>Loading...</p>;
        }
        if (isSignedIn) {
          return children;
        }
        return <Redirect to="/" />;
      }}
    </FirebaseAuthContext.Consumer>
  );
}
