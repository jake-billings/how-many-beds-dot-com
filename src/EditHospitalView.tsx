import React, { Component, FormEvent } from 'react'
import { Hospital, validateHospital } from './types'
import HospitalInput from './HospitalInput'
import firebase from './firebase'

type Props = {
  match: {
    params: {
      hospitalId: string
    }
  }
}

type State = {
  loading: boolean,
  loaded: boolean,
  saving: boolean,
  hospital: Hospital
}

class EditHospitalView extends Component<Props, State> {
  state = {
    loading: false,
    loaded: false,
    saving: false,
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
  canSave = () => !this.state.loading && this.state.loaded && !this.state.saving && this.getHospitalValidationErrors().length === 0

  componentDidMount = () => {
    this.load()
  }

  load = () => {
    this.setState({ loading: true, loaded: false })

    firebase.database().ref(`hospitals/${this.props.match.params.hospitalId}`)
      .on('value', (ref) => {
        const val = ref.val();
        if (val) {
          this.setState({loading: false, loaded: true, hospital: val})
        } else {
          this.setState({loading: false, loaded: false, hospital: val})
        }
      })

  }

  save = (e: FormEvent<HTMLFormElement>) => {
    // Prevent the default, so we don't get a page reload
    e.preventDefault()

    // Don't allow spammy clicking to submit this form twice
    if (!this.canSave()) return

    // Transition to the "saving" state so that we don't get additional saves at the same time
    this.setState({ saving: true })

    try {
      firebase.database().ref(`hospitals/${this.props.match.params.hospitalId}`)
        .set(this.state.hospital)
    } catch (e) {
      console.error(e)
    } finally {
      // Transition out of the "creating" state so that the form opens again
      this.setState({ saving: false })
    }
  }

  onChangeToHospital = (hospital: Hospital) => {
    this.setState({ hospital })
  }

  render () {
    return (
      <>
        {this.state.loading && (
          <>
            <h1>Loading</h1>
          </>
        )}
        {!this.state.loading && !this.state.loaded && (
          <>
            <h1>Problem loading</h1>
          </>
        )}
        {this.state.loaded && (
          <div>
            <form onSubmit={this.save}>
              <HospitalInput
                initialState={this.state.hospital}
                onChange={this.onChangeToHospital}
              />
              {this.getHospitalValidationErrors().length > 0 && (
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
                    value="Save"
                    disabled={!this.canSave()}
                  />
                </div>
              </div>
            </form>
          </div>
        )}
      </>
    )
  }
}

export default EditHospitalView
