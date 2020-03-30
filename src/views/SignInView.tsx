import React, { useContext } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from '../firebase';
import { Redirect } from 'react-router';
import { FirebaseAuthContext } from '../providers/FirebaseAuth';

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'redirect',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
    },
  ],
};

export default function SignInView(): JSX.Element {
  const { loading, user } = useContext(FirebaseAuthContext);
  return (
    <>
      {loading && <p>Loading...</p>}
      {!loading && (
        <>
          {user && (
            <>
              <Redirect to="/" />
            </>
          )}
          {!user && (
            <>
              <p>Please sign-in:</p>
              <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
            </>
          )}
        </>
      )}
    </>
  );
}
