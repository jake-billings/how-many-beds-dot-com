import React, { Component } from 'react'
import firebase from './firebase'
import { Hospital } from './types'

type Props = {}

type State = {
  loading: boolean,
  hospitals: Hospital[]
}

class HospitalsView extends Component<Props, State> {
  state = {
    loading: true,
    hospitals: [] as Hospital[],
  }

  componentDidMount = async () => {
    this.setState({ loading: true })
    const hospitals = firebase.database().ref('hospitals')
    hospitals.on('value', snapshot => {
      this.setState({
        loading: false,
        hospitals: Object.values(snapshot.val()) as Hospital[],
      })
    })
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
          <ul>
            <li>Address: {hospital.address}</li>
            <li>Total Bed Count: {hospital.totalBedCount}</li>
            <li>Beds Occupied: {hospital.occupiedBedCount}</li>
            <li>Beds Available: {hospital.totalBedCount - hospital.occupiedBedCount}</li>
            <li>Utilization: {(hospital.occupiedBedCount / hospital.totalBedCount*100).toFixed(2)}%</li>
          </ul>
        </div>
      ))}
    </>
  )
}

export default HospitalsView
