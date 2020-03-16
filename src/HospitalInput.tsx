import React, { Component } from 'react'
import NumericInput from 'react-numeric-input'
import { Hospital } from './types'

type Props = {
  initialState: Hospital | null,
  onChange: (hospital: Hospital) => void
}

type State = {
  hospital: Hospital
}

class HospitalInput extends Component<Props, State> {
  state = {
    hospital: {
      name: '',
      address: '',
      totalBedCount: 0,
      occupiedBedCount: 0,
    },
  }

  componentDidMount = () => {
    if (this.props.initialState) this.setState({ hospital: this.props.initialState })
  }

  updateHospitalField = (fieldName: string) => (val: any) => {
    this.setState(state => {
      const hospital = { ...state.hospital } as any
      hospital[fieldName] = val
      this.props.onChange(hospital)
      return { hospital }
    })
  }

  updateHospitalFieldWithEvent = (fieldName: string) => (e: any) => {
    const val = e.target.value
    this.setState(state => {
      const hospital = { ...state.hospital } as any
      hospital[fieldName] = val
      this.props.onChange(hospital)
      return { hospital }
    })
  }

  render () {
    return (
      <div className="form-row my-2">
        <div className="col-6">
          <label>Name</label>
          <input type="text"
                 className="form-control"
                 placeholder="Medical facilities name"
                 value={this.state.hospital.name}
                 onChange={this.updateHospitalFieldWithEvent('name')}
          />
        </div>
        <div className="col-6">
          <label>Address</label>
          <input type="text"
                 className="form-control"
                 placeholder="Location"
                 value={this.state.hospital.address}
                 onChange={this.updateHospitalFieldWithEvent('address')}
          />
        </div>
        <div className="col-6">
          <label>Total Bed Count</label>
          <NumericInput
            type="number"
            className="form-control"
            placeholder="500"
            min={0}
            value={this.state.hospital.totalBedCount}
            onChange={this.updateHospitalField('totalBedCount')}/>
        </div>
        <div className="col-6">
          <label>Occupied Bed Count</label>
          <NumericInput
            type="number"
            className="form-control"
            placeholder="0"
            min={0}
            max={this.state.hospital.totalBedCount}
            value={this.state.hospital.occupiedBedCount}
            onChange={this.updateHospitalField('occupiedBedCount')}/>
        </div>
      </div>
    )
  }
}

export default HospitalInput