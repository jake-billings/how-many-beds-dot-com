import React from 'react'
import firebase from './firebase'
import { Unsubscribe } from 'firebase'

import { Link } from 'react-router-dom'

type Props = {}
type State = { loading: boolean, isSignedIn: boolean }

class SignInOutButton extends React.Component<Props, State> {
  state = { loading: true, isSignedIn: false }

  unregisterAuthObserver: Unsubscribe | undefined = undefined

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount () {
    this.unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((firebaseAuthUser) => {
        this.setState({ isSignedIn: !!firebaseAuthUser, loading: false })
      })
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount () {
    if (this.unregisterAuthObserver) this.unregisterAuthObserver()
  }

  signOut () {
    firebase.auth().signOut()
  }

  render () {
    return (
      <>
        {!this.state.loading && (
          <>
            {this.state.isSignedIn && (
              <button className="link" onClick={this.signOut}>Sign Out</button>
            )}
            {!this.state.isSignedIn && (
              <Link to="/sign-in">Sign In</Link>
            )}
          </>
        )}
      </>
    )
  }
}

export default SignInOutButton
