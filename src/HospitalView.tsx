import React, { Component } from 'react'
import css from './forms.module.css'
import NumericInput from 'react-numeric-input'
import { Hospital } from './types'

type Props = {}

type State = {
  hospitalId: string | null,
  hospital: Hospital
}

class HospitalView extends Component<Props, State> {
  state = {
    hospitalId: null,
    hospital: {
      name: '',
      address: '',
      totalBedCount: 0,
      occupiedBedCount: 0,
    },
  }

  updateHospitalField = (fieldName: string) => (val: any) => {
    this.setState(state => {
      const hospital = { ...state.hospital } as any
      hospital[fieldName] = val
      return { hospital }
    })
  }

  updateHospitalFieldWithEvent = (fieldName: string) => (e: any) => {
    const val = e.target.value
    this.setState(state => {
      const hospital = { ...state.hospital } as any
      hospital[fieldName] = val
      return { hospital }
    })
  }

  render () {
    return (
      <div className={css.formContainer}>
        <form>
          <div className="form-row my-2">
            <div className="col-6">
              <label>Name</label>
              <input type="text"
                     className="form-control"
                     placeholder="Medical facilities name"
                     onChange={this.updateHospitalFieldWithEvent('name')}
              />
            </div>
            <div className="col-6">
              <label>Location</label>
              <input type="text"
                     className="form-control"
                     placeholder="Location"
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
          <div className="form-row">
            <div className="col-1">
              <button className="btn btn-primary">Save</button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default HospitalView