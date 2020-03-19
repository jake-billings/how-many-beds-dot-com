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

class HospitalsView extends Component<PublicProps & RouteComponentProps, State> {
  state = {
    loading: true,
    hospitals: [] as HospitalForUI[],
    isAdmin: false,
    location: null,
  }

  ref: firebase.database.Reference | null = null

  componentDidMount = async () => {
    this.setState({ loading: true })
    this.ref = firebase.database().ref('hospitals')
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

  getHospitals = () => {
    if (!this.state.location) return this.state.hospitals
    const location: Location = this.state.location as unknown as Location

    return this.state.hospitals
      .map(hospital => {
        return {
          ...hospital,
          distanceMiles: 0.000621371 * getDistance({
            latitude: location.lat,
            longitude: location.lng,
          }, {
            latitude: hospital.location.lat,
            longitude: hospital.location.lng,
          })
        }
      })
      .sort((a, b) => {
        return a.distanceMiles - b.distanceMiles
      })
  }

  onLocationChange = (location: Location | null) => {
    this.setState({location})
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
