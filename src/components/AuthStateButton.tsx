import React, { useContext } from 'react';
import firebase from '../firebase';

import { Link } from 'react-router-dom';
import { FirebaseAuthContext } from '../providers/FirebaseAuth';

export default function AuthStateButton(): JSX.Element {
  const authState = useContext(FirebaseAuthContext);

  const signOut = (): void => {
    firebase.auth().signOut();
  };

  return (
    <>
      {!authState.loading && (
        <>
          {authState.isSignedIn && (
            <button className="link" onClick={signOut}>
              Sign Out
            </button>
          )}
          {!authState.isSignedIn && <Link to="/sign-in">Sign In</Link>}
        </>
      )}
    </>
  );
}
