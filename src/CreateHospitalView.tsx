import React, { Component, FormEvent } from 'react'
import { RouteComponentProps } from 'react-router'
import { Row, Col } from 'react-grid-system'

import { Hospital, validateHospital } from './types'
import HospitalInput from './HospitalInput'
import firebase from './firebase'
import Navbar from './components/Navbar'
import Container from './components/Container'
import Box from './components/Box'
import Card from './components/Card'
import Button from './components/Button'
import { Header1, Header3 } from './components/type'

type PublicProps = {}

type State = {
  creating: boolean,
  attemptedCreate: boolean,
  created: boolean,
  hospital: Hospital
}

/**
 * CreateHospitalView
 *
 * React Component/View
 *
 * This component is responsible for managing writing a new hospital to the database.
 */
class CreateHospitalView extends Component<PublicProps & RouteComponentProps, State> {
  state = {
    creating: false,
    attemptedCreate: false,
    created: false,
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
   * getHospitalValidationErrors()
   *
   * function
   *
   * returns an array of strings describing validation problems with the current hospital object
   */
  getHospitalValidationErrors = () => {
    return validateHospital(this.state.hospital)
  }

  /**
   * canCreate()
   *
   * function
   *
   * returns true if it is valid to perform a create operation
   * used to enable/disable form submission
   * used to enable/disable submit button
   *
   * We can only create a hospital if we are not in the process of creating it and haven't created it yet
   */
  canCreate = () =>
    !this.state.creating
    && !this.state.created
    && this.getHospitalValidationErrors().length === 0

  /**
   * save()
   *
   * function
   *
   * if we can create, we create
   * then, navigate to the hospitals view
   *
   * if there's an error, log it
   * if we can't create yet, do nothing
   */
  create = (e: FormEvent<HTMLFormElement>) => {
    // Prevent the default, so we don't get a page reload
    e.preventDefault()

    // Don't allow spammy clicking to submit this form twice
    if (!this.canCreate()) return

    // Transition to the "creating" state so that we don't get additional submits
    this.setState({ creating: true, attemptedCreate: true })

    try {
      // No need to store this ref since we didn't register any listeners
      firebase.database().ref('hospitals').push(this.state.hospital)

      // Transition out of the "creating" state so that the form opens again
      this.setState({ created: true, creating: false })

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
        <Navbar />
        <Box mv={5}>
          <Container>
            <Row>
              <Col sm={8} offset={{ sm: 2 }}>
                <Box mb={2}>
                  <Header1>Create Hospital</Header1>
                </Box>
                <Card>
                  <form onSubmit={this.create}>
                    <HospitalInput
                      initialValue={this.state.hospital}
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
                        <Button
                          type="submit"
                          disabled={!this.canCreate()}
                        >Create</Button>
                      </div>
                    </div>
                  </form>
                </Card>
              </Col>
            </Row>
          </Container>
        </Box>
      </>
    )
  }
}

export default CreateHospitalView
