import React, { Component, FormEvent } from 'react'
import { Hospital, validateHospital } from './types'
import HospitalInput from './HospitalInput'
import firebase from './firebase'
import { RouteComponentProps } from 'react-router'

type PublicProps = {}

type State = {
  loading: boolean,
  loaded: boolean,
  saving: boolean,
  hospital: Hospital
}

class EditHospitalView extends Component<PublicProps & RouteComponentProps<{hospitalId: string}>, State> {
  state = {
    loading: false,
    loaded: false,
    saving: false,
    hospital: {
      name: '',
      location: {
        address: '',
        googleMapsPlaceId: '',
        lat: 0,
        lng: 0,
      },
      totalBedCount: 0,
      occupiedBedCount: 0,
    },
  }

  ref: firebase.database.Reference | null = null

  getHospitalValidationErrors = () => {
    return validateHospital(this.state.hospital)
  }

  // We can only create a hospital if we are not in the process of creating it and haven't created it yet
  canSave = () => !this.state.loading && this.state.loaded && !this.state.saving && this.getHospitalValidationErrors().length === 0

  componentDidMount = () => {
    this.setState({ loading: true, loaded: false })

    this.ref = firebase.database().ref(`hospitals/${this.props.match.params.hospitalId}`)
    this.ref.on('value', (ref) => {
      const val = ref.val();
      if (val) {
        this.setState({loading: false, loaded: true, hospital: val})
      } else {
        this.setState({loading: false, loaded: false, hospital: val})
      }
    })
  }

  componentWillUnmount = () => {
    if (this.ref) this.ref.off()
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

      this.props.history.push(`/hospitals${this.props.location.search}`)

      // Transition out of the "creating" state so that the form opens again
      this.setState({ saving: false })
    } catch (e) {
      console.error(e)
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
        <h1>Edit Hospital</h1>
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
                initialValue={this.state.hospital}
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
