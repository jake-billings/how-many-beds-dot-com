import React, { Component } from 'react'
import firebase from './firebase'
import { Hospital } from './types'
import queryString from 'query-string'
import {
  Link,
} from 'react-router-dom'

type Props = {
  location: {
    search: string
  }
}

interface HospitalWithKey extends Hospital {
  id: string
}

type State = {
  loading: boolean,
  hospitals: HospitalWithKey[],
  isAdmin: boolean
}

class HospitalsView extends Component<Props, State> {
  state = {
    loading: true,
    hospitals: [] as HospitalWithKey[],
    isAdmin: false,
  }

  componentDidMount = async () => {
    this.setState({ loading: true })
    const hospitals = firebase.database().ref('hospitals')
    hospitals.on('value', snapshot => {
      const val = snapshot.val()
      const hospitals = Object
        .keys(val)
        .map(key => {
          return {
            id: key,
            ...val[key],
          }
        }) as HospitalWithKey[]

      this.setState({
        loading: false,
        hospitals,
      })
    })

    if (queryString.parse(this.props.location.search).admin) {
      this.setState({ isAdmin: true })
    }
  }

  render = () => (
    <>
      <h1>Hospitals</h1>
      {this.state.loading && (
        <p>Loading...</p>
      )}
      {this.state.hospitals.map((hospital, index) => (
        <div key={index}>
          <h2>{hospital.name}</h2>
          {this.state.isAdmin && (
            <Link to={`/hospitals/${hospital.id}`}>Edit</Link>
          )}
          <ul>
            <li>Address: {hospital.address}</li>
            <li>Total Bed Count: {hospital.totalBedCount}</li>
            <li>Beds Occupied: {hospital.occupiedBedCount}</li>
            <li>Beds Available: {hospital.totalBedCount - hospital.occupiedBedCount}</li>
            <li>Utilization: {(hospital.occupiedBedCount / hospital.totalBedCount * 100).toFixed(2)}%</li>
          </ul>
        </div>
      ))}
      {this.state.isAdmin && (
        <Link to="/hospitals/new">New</Link>
      )}
    </>
  )
}

export default HospitalsView
