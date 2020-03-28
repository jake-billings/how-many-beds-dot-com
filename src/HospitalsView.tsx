import React, { Component } from 'react'
import firebase from './firebase'
import { Location, HospitalForUI, User } from './types'
import { getDistance } from 'geolib'
import { Row, Col } from 'react-grid-system'

import {
  RouteComponentProps,
} from 'react-router-dom'
import HospitalCard from './components/HospitalCard'
import Box from './components/Box'
import Container from './components/Container'
import Navbar from './components/Navbar'
import HospitalMap from './components/HospitalMap'
import { Unsubscribe } from 'firebase'

type PublicProps = {}

type State = {
  loadings: boolean,
  hospitals: HospitalForUI[],
  location: Location | null
  user: User | null
}

/**
 * HospitalsView
 *
 * React component/View
 *
 * This view is responsible for loading and displaying a list of hospitals.
 */
class HospitalsView extends Component<PublicProps & RouteComponentProps, State> {
  state = {
    loadings: true,
    hospitals: [] as HospitalForUI[],
    location: null,
    user: null,
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
  hospitalRef: firebase.database.Reference | null = null

  unregisterAuthObserver: Unsubscribe | null | undefined = undefined

  userRef: firebase.database.Reference | null = null

  componentDidMount = async () => {
    this.setState({ loadings: true })

    //Setup our firebase database reference
    this.hospitalRef = firebase.database().ref('hospitals')

    //Add a listener (unregistered in componentWillUnmount)
    this.hospitalRef.on('value', snapshot => {
      const val = snapshot.val()

      let hospitals: HospitalForUI[]
      if (val) {
        hospitals = Object
          .keys(val)
          .map(key => {
            return {
              id: key,
              ...val[key],
            }
          }) as HospitalForUI[]
      } else {
        hospitals = []
      }

      this.setState({
        loadings: false,
        hospitals,
      })
    })

    this.unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((firebaseAuthUser) => {
          if (firebaseAuthUser && firebaseAuthUser.uid) {
            if (this.userRef) this.userRef.off()

            this.userRef = firebase.database().ref(`users/${firebaseAuthUser.uid}`)

            this.userRef.on('value', (ref) => {
              const val: User = ref.val() as User

              this.setState({ user: val })
            })
          } else {
            this.setState({ user: null })
          }
        },
      )
  }

  componentWillUnmount = () => {
    if (this.hospitalRef) this.hospitalRef.off()
    if (this.userRef) this.userRef.off()
    if (this.unregisterAuthObserver) this.unregisterAuthObserver()
  }

  deleteHospitalById = (id: string) => (e: any) => {
    firebase.database().ref(`hospitals/${id}`).remove()
  }

  /**
   * getHospitals()
   *
   * function - getter
   *
   * Even though hospitals just sit in the state, we have a getter for them.
   * This is because we want to recalculate distance and resort hospitals every time we render.
   *  (At least for now since this keeps the state minimal)
   *
   * This function returns the raw list if there is no selected location.
   * If there is a selected locatin, it calculates how far each hospital is from the user's location
   *  and order the hospitals closest to farthest.
   */
  getHospitals = () => {
    // If there's no selected location, just return the list of hospitals.
    if (!this.state.location) return this.state.hospitals

    // Otherwise, we know we have a location
    const location: Location = this.state.location as unknown as Location

    // Map and order here
    return this.state.hospitals
      .map(hospital => {
        return {
          ...hospital,

          // getDistance from geolib returns distance in meters
          // we want distance in miles
          // There are 0.000621371 miles per meter
          // So run the conversion right here
          distanceMiles: 0.000621371 * getDistance({
            latitude: location.lat,
            longitude: location.lng,
          }, {
            latitude: hospital.location.lat,
            longitude: hospital.location.lng,
          }),
        }
      })
      .sort((a, b) => {
        return a.distanceMiles - b.distanceMiles
      })
  }

  onLocationChange = (location: Location | null) => {
    this.setState({ location })
  }

  isSignedIn = () => !!this.state.user

  canCreateHospital = () => this.isSignedIn()
    && (this.state.user as unknown as User).isAdmin

  canEditHospital = (hospitalId: string) => this.isSignedIn()
    && (
      ((this.state.user as unknown as User).editorOf === hospitalId)
      || (this.state.user as unknown as User).isAdmin
    )

  render = () => (
    <>
      <Navbar
        onLocationChange={this.onLocationChange}
        canCreateNewHospital={this.canCreateHospital()}
        searchQuery={this.props.location.search}
      />
      <Container>
        {this.state.loadings && (
          <p>Loading...</p>
        )}
        <Box mv={5}>
          <Row>
            <Col md={8}>
              <Row>
                {this.getHospitals().map((hospital) => (
                  <Col sm={6} key={hospital.id}>
                    <Box mb={3}>
                      <HospitalCard
                        hospital={hospital}
                        editHospitalLink={this.canEditHospital(hospital.id) && `/hospitals/${hospital.id}${this.props.location.search}`}
                        onDeleteHospital={this.canEditHospital(hospital.id) && this.deleteHospitalById(hospital.id)}
                      />
                    </Box>
                  </Col>
                ))}
              </Row>
            </Col>
            <Col md={4}>
              <HospitalMap
                location={this.state.location}
                hospitals={this.state.hospitals}
              />
            </Col>
          </Row>
        </Box>
      </Container>
    </>
  )
}

export default HospitalsView
