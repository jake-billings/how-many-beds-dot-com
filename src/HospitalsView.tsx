import React, { Component } from 'react'
import firebase from './firebase'
import { Hospital, Location } from './types'
import queryString from 'query-string'
import HospitalUtilizationChart from './HospitalUtilizationChart'
import { getDistance } from 'geolib'

import {
  Link, RouteComponentProps,
} from 'react-router-dom'
import LocationSearchInput from './LocationInput'

type PublicProps = {}

interface HospitalForUI extends Hospital {
  id: string,
  distanceMiles?: number
}

type State = {
  loading: boolean,
  hospitals: HospitalForUI[],
  isAdmin: boolean
  location: Location | null
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
    loading: true,
    hospitals: [] as HospitalForUI[],
    isAdmin: false,
    location: null,
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
  ref: firebase.database.Reference | null = null

  componentDidMount = async () => {
    this.setState({ loading: true })

    //Setup our firebase database reference
    this.ref = firebase.database().ref('hospitals')

    //Add a listener (unregistered in componentWillUnmount)
    this.ref.on('value', snapshot => {
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
        loading: false,
        hospitals,
      })
    })

    if (queryString.parse(this.props.location.search).admin) {
      this.setState({ isAdmin: true })
    }
  }

  componentWillUnmount = () => {
    if (this.ref) this.ref.off()
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

  render = () => (
    <>
      <h1>Hospitals</h1>
      <h2>Your Location</h2>
      <LocationSearchInput
        initialValue={null}
        onChange={this.onLocationChange}
        googleMapsSearchOptions={{}}
      />
      {this.state.loading && (
        <p>Loading...</p>
      )}
      {this.getHospitals().map((hospital, index) => (
        <div key={index}>
          <h2>{hospital.name}</h2>
          {this.state.isAdmin && (
            <Link to={`/hospitals/${hospital.id}${this.props.location.search}`}>
              <button className="btn btn-link">Edit</button>
            </Link>
          )}

          {this.state.isAdmin && (
            <button className="btn btn-link" onClick={this.deleteHospitalById(hospital.id)}>Delete</button>
          )}
          <div style={{ width: '300px' }}>
            <HospitalUtilizationChart
              hospital={hospital}
            />
          </div>
          <ul>
            <li>Address: {hospital.location.address}</li>
            <li>Total Bed Count: {hospital.totalBedCount}</li>
            <li>Beds Occupied: {hospital.occupiedBedCount}</li>
            <li>Beds Available: {hospital.totalBedCount - hospital.occupiedBedCount}</li>
            <li>Utilization: {(hospital.occupiedBedCount / hospital.totalBedCount * 100).toFixed(2)}%</li>
            {hospital.distanceMiles && (
              <li>Distance: {hospital.distanceMiles.toFixed(2)} Miles</li>
            )}
          </ul>
        </div>
      ))}
      {this.state.isAdmin && (
        <Link to={`/hospitals/new${this.props.location.search}`}>New</Link>
      )}
    </>
  )
}

export default HospitalsView
