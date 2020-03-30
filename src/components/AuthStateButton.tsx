import React, { useContext } from 'react';
import firebase from '../firebase';

import { FirebaseAuthContext } from '../providers/FirebaseAuth';

import { StyledNavLink, StyledNavButton } from './ui/type';
import Box from './ui/Box';

export default function AuthStateButton(): JSX.Element {
  const authState = useContext(FirebaseAuthContext);

  const signOut = (): void => {
    firebase.auth().signOut();
  };

  return (
    <>
      {!authState.loading && (
        <Box ml={3}>
          {authState.isSignedIn && (
            <StyledNavButton className="link" onClick={signOut}>
              Sign Out
            </StyledNavButton>
          )}
          {!authState.isSignedIn && <StyledNavLink to="/sign-in">Sign In</StyledNavLink>}
        </Box>
      )}
    </>
  );
}
