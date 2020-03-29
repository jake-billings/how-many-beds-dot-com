import React from 'react'
import { Component } from 'react'
import { Unsubscribe } from 'firebase'
import firebase from './firebase'
import { HospitalForUI, User, UserForUI } from './types'
import { Redirect } from 'react-router'
import Select from 'react-select'

type Option = {value: string, label: string}

type Props = {}

type State = {
  user: UserForUI | null,
  loadingUser: boolean
  users: UserForUI[] | null
  loadingUsers: boolean
  hospitals: HospitalForUI[] | null
  loadingHospitals: boolean
}

class AdminUserView extends Component<Props, State> {
  state = {
    user: null,
    loadingUser: true,
    users: null,
    loadingUsers: true,
    hospitals: null,
    loadingHospitals: true,
  }

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
  userRef: firebase.database.Reference | null = null
  usersRef: firebase.database.Reference | null = null
  hospitalsRef: firebase.database.Reference | null = null

  unregisterAuthObserver: Unsubscribe | undefined = undefined

  componentDidMount = () => {
    this.unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((firebaseAuthUser) => {
          if (firebaseAuthUser && firebaseAuthUser.uid) {

            if (this.userRef) this.userRef.off()

            this.userRef = firebase.database().ref(`users/${firebaseAuthUser.uid}`)

            this.userRef.update({
              lastSignedIn: new Date(),
            })

            this.userRef.on('value', (ref) => {
              const val: User = ref.val() as User

              if (this.usersRef) this.usersRef.off()

              const user: UserForUI = {
                id: firebaseAuthUser.uid,
                ...val
              }

              this.setState({ user, loadingUser: false, users: null, loadingUsers: true })

              if (val.isAdmin) {

                this.usersRef = firebase.database().ref('users')

                this.usersRef.on('value', (usersRef) => {
                  const usersVal: any = usersRef.val()

                  const users: UserForUI[] = Object
                    .keys(usersVal)
                    .map(key => {
                      return {
                        ...usersVal[key],
                        id: key,
                      }
                    })

                  this.setState({ users, loadingUsers: false })
                })

              } else {
                this.setState({ users: null, loadingUsers: false })
              }
            })
          } else {
            this.setState({ user: null, loadingUser: false, users: null, loadingUsers: false })
          }
        },
      )

    this.hospitalsRef = firebase.database().ref('hospitals')

    this.hospitalsRef.on('value', ref => {
      const val: any = ref.val()

      let hospitals: HospitalForUI[] | null = null
      if (val) {
        hospitals = Object
          .keys(val)
          .map(key => {
            return {
              id: key,
              ...val[key],
            }
          }) as HospitalForUI[]
      }

      this.setState({ hospitals, loadingHospitals: false })
    })
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount () {
    if (this.unregisterAuthObserver) this.unregisterAuthObserver()
    if (this.usersRef) this.usersRef.off()
    if (this.userRef) this.userRef.off()
    if (this.hospitalsRef) this.hospitalsRef.off()
  }

  isLoading = () => (this.state.loadingUser || this.state.loadingUsers || this.state.loadingHospitals)

  isLoggedInAsAdmin = () => this.state.user && (this.state.user as unknown as User).isAdmin

  getHospitalSelectOptions = (): Option[] => (this.state.hospitals as unknown as HospitalForUI[]).map(hospital => {
    return {
      value: hospital.id,
      label: hospital.name,
    }
  })

  getHospital = (hospitalId: string) => this
    .getHospitalSelectOptions()
    .filter(hospital => hospital.value === hospitalId)[0]

  onSelectHospital = (userId: string) => (selection: any) => {
    firebase
      .database()
      .ref(`users/${userId}`)
      .update({
        editorOf: selection.value
      })
  }

  onIsAdminChange = (userId: string) => (event: any) => {
    firebase
      .database()
      .ref(`users/${userId}`)
      .update({
        isAdmin: event.target.checked
      })
  }

  render = () => (
    <>
      {this.isLoading() && (
        <p>Loading...</p>
      )}
      {!this.isLoading() && (
        <>
          {!this.isLoggedInAsAdmin() && (
            <Redirect to="/"/>
          )}
          {this.isLoggedInAsAdmin() && (
            <>
              <table>
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Is Admin</th>
                  <th>Editor Of</th>
                </tr>
                </thead>
                <tbody>
                {(this.state.users as unknown as UserForUI[]).map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                    <td>
                      <label>
                      <input
                        type="checkbox"
                        checked={user.isAdmin}
                        onChange={this.onIsAdminChange(user.id)}
                        disabled={user.id === (this.state.user as unknown as UserForUI).id}
                      />
                      </label>
                    </td>
                    <td style={{'width': '300px'}}>
                      <Select
                        value={this.getHospital(user.editorOf)}
                        onChange={this.onSelectHospital(user.id)}
                        options={this.getHospitalSelectOptions() as any}
                      />
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </>
          )}
        </>
      )}
    </>
  )
}

export default AdminUserView
