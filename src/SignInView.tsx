import React from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from './firebase'
import { Unsubscribe } from 'firebase'
import { User } from './types'
import { Redirect } from 'react-router'

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'redirect',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/',
  // We will display Google and Facebook as auth providers.
  signInOptions: [{
    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
  }],
}

type Props = {}
type State = { user: User | null, loading: boolean }

class SignInView extends React.Component<Props, State> {
  state = { user: null, loading: true }

  unregisterAuthObserver: Unsubscribe | null | undefined = undefined

  /**
   * ref
   *
   * firebase database reference (or null)
   *
   * This is the firebase reference we use to interact with the database. We must store a copy of it
   *  so that we can close out the watcher when the component unmounts. Otherwise, we will have a memory
   *  leak. Since new database update events will trigger state updates in an unmounted component.
   *
   * See componentDidMount for setup
   * See componentWillUnmount for teardown
   */
  ref: firebase.database.Reference | null = null

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount () {
    this.unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((firebaseAuthUser) => {
          if (firebaseAuthUser && firebaseAuthUser.uid) {
            if (this.ref) this.ref.off()

            this.ref = firebase.database().ref(`users/${firebaseAuthUser.uid}`)

            this.ref.update({
              lastSignedIn: new Date(),
              email: firebaseAuthUser.email
            })

            this.ref.on('value', (ref) => {
              const val: User = ref.val() as User

              this.setState({ user: val, loading: false })
            })
          } else {
            this.setState({ user: null, loading: false })
          }
        },
      )
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount () {
    if (this.unregisterAuthObserver) this.unregisterAuthObserver()
    if (this.ref) this.ref.off()
  }

  render () {
    return (
      <>
        {this.state.loading && (
          <p>Loading...</p>
        )}
        {!this.state.loading && (
          <>
            {this.state.user && (
              <>
                <Redirect to="/"/>
              </>
            )}
            {!this.state.user && (
              <>
                <p>Please sign-in:</p>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
              </>
            )}
          </>
        )}
      </>
    )
  }
}

export default SignInView
