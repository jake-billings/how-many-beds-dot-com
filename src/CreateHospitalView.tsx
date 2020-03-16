import React, { Component, FormEvent } from 'react'
import { Hospital, validateHospital } from './types'
import HospitalInput from './HospitalInput'
import firebase from './firebase'
import { RouteComponentProps } from 'react-router'

type PublicProps = {}

type State = {
  creating: boolean,
  attemptedCreate: boolean,
  created: boolean,
  hospital: Hospital
}

class CreateHospitalView extends Component<PublicProps & RouteComponentProps, State> {
  state = {
    creating: false,
    attemptedCreate: false,
    created: false,
    hospital: {
      name: '',
      address: '',
      totalBedCount: 0,
      occupiedBedCount: 0,
    },
  }

  getHospitalValidationErrors = () => {
    return validateHospital(this.state.hospital)
  }

  // We can only create a hospital if we are not in the process of creating it and haven't created it yet
  canCreate = () => !this.state.creating && !this.state.created && this.getHospitalValidationErrors().length === 0

  create = (e: FormEvent<HTMLFormElement>) => {
    // Prevent the default, so we don't get a page reload
    e.preventDefault()

    // Don't allow spammy clicking to submit this form twice
    if (!this.canCreate()) return

    // Transition to the "creating" state so that we don't get additional submits
    this.setState({ creating: true, attemptedCreate: true })

    try {
      firebase.database().ref('hospitals').push(this.state.hospital)
      this.setState({ created: true })

      // Transition out of the "creating" state so that the form opens again
      this.setState({ creating: false })

      this.props.history.push(`/hospitals${this.props.location.search}`)
    } catch (e) {
      console.error(e)
      // Transition out of the "creating" state so that the form opens again
      this.setState({ creating: false })
    }
  }

  onChangeToHospital = (hospital: Hospital) => {
    this.setState({ hospital })
  }

  render () {
    return (
      <>
        <h1>Create Hospital</h1>
        <div>
          <form onSubmit={this.create}>
            <HospitalInput
              initialState={this.state.hospital}
              onChange={this.onChangeToHospital}
            />
            {this.state.attemptedCreate && (
              <>
                <ul>
                  {this.getHospitalValidationErrors().map(error => (
                    <li key={error}>
                      {error}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className="form-row">
              <div className="col-1">
                <input
                  type="submit"
                  className="btn btn-primary"
                  value="Create"
                  disabled={!this.canCreate()}
                />
              </div>
            </div>
          </form>
        </div>
      </>
    )
  }
}

export default CreateHospitalView
