import React, { Component, FormEvent } from 'react'
import { RouteComponentProps } from 'react-router'
import { Row, Col } from 'react-grid-system'

import Navbar from './components/Navbar'
import { Header1, Text } from './components/type'
import Container from './components/Container'
import Box from './components/Box'
import Card from './components/Card'
import Button from './components/Button'

import { Hospital, validateHospital } from './types'
import HospitalInput from './HospitalInput'
import firebase from './firebase'

type PublicProps = {}

type State = {
  loading: boolean,
  loaded: boolean,
  saving: boolean,
  hospital: Hospital
}

/**
 * EditHospitalView
 *
 * React Component/View
 *
 * This component is responsible for loading and writing data to/from Firebase when we are editing a particular
 *  hospital that already exists. The input fields have been abstracted into HospitalInput. New hospitals are created
 *  via the NewHospitalView.
 *
 * This component redirects back to the hospitals view upon saving.
 */
class EditHospitalView extends Component<PublicProps & RouteComponentProps<{ hospitalId: string }>, State> {
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

  /**
   * getHospitalValidationErrors()
   *
   * function
   *
   * returns an array of strings describing validation problems with the current hospital object
   */
  getHospitalValidationErrors = (): string[] => {
    return validateHospital(this.state.hospital)
  }

  /**
   * canSave()
   *
   * function
   *
   * returns true if it is valid to perform a save operation
   * used to enable/disable form submission
   * used to enable/disable submit button
   *
   * We can only create a hospital if we are not in the process of creating it and haven't created it yet
   */
  canSave = (): boolean =>
    !this.state.loading
    && this.state.loaded
    && !this.state.saving
    && this.getHospitalValidationErrors().length === 0

  componentDidMount = () => {
    this.setState({ loading: true, loaded: false })

    this.ref = firebase.database().ref(`hospitals/${this.props.match.params.hospitalId}`)
    this.ref.on('value', (ref) => {
      const val = ref.val()
      if (val) {
        this.setState({ loading: false, loaded: true, hospital: val })
      } else {
        this.setState({ loading: false, loaded: false, hospital: val })
      }
    })
  }

  componentWillUnmount = () => {
    if (this.ref) this.ref.off()
  }

  /**
   * save()
   *
   * function
   *
   * if we can save, we save
   * then, navigate to the hospitals view
   *
   * if there's an error, log it
   * if we can't save yet, do nothing
   */
  save = (e: FormEvent<HTMLFormElement>) => {
    // Prevent the default, so we don't get a page reload
    e.preventDefault()

    // Don't allow spammy clicking to submit this form twice
    if (!this.canSave()) return

    // Transition to the "saving" state so that we don't get additional saves at the same time
    this.setState({ saving: true })

    try {
      if (this.ref) {
        this.ref.set(this.state.hospital)
      } else {
        throw new Error('Ref not instantiated - illegal state')
      }

      //Navigate back to the hospital view whilst preserving the query string
      // We navigate back as a UX decision
      // The query string contains (or doesn't contain) the admin parameter and we want to maintain this state,
      //  so we pass it
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
        <Navbar />
        <Box mv={5}>
          <Container>
            <Row>
              <Col sm={8} offset={{ sm: 2 }}>
                <Box mb={2}>
                  <Header1>Edit Hospital</Header1>
                </Box>
                <Card>
                  {this.state.loading && <Text>Loading...</Text>}
                  {!this.state.loading && !this.state.loaded && <Text>Problem loading</Text>}
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
                            <Button
                              type="submit"
                              disabled={!this.canSave()}
                            >Save</Button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}
                </Card>
              </Col>
            </Row>
          </Container>
        </Box>
      </>
    )
  }
}

export default EditHospitalView
