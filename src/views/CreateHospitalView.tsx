import React, { Component, FormEvent, useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { Row, Col } from 'react-grid-system';

import { Hospital, validateHospital } from '../types';
import HospitalInput from '../components/HospitalInput';
import firebase from '../firebase';
import Navbar from '../components/Navbar';
import Container from '../components/ui/Container';
import Box from '../components/ui/Box';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Header1 } from '../components/ui/type';

import { ProtectedRoute } from '../providers/FirebaseAuth';

type PublicProps = RouteComponentProps;

const defaultHospital = {
  name: '',
  location: {
    address: '',
    googleMapsPlaceId: '',
    lat: 0,
    lng: 0,
  },
  phone: '',
  capacityPercent: 50,
  isCovidCenter: false,
  sharingCovidPatientCount: false,
  covidPatientCount: 0,
  covidCapableBedCount: 0,
  icuCovidCapableBedCount: 0,
  ventilatorCount: 0,
};

export default function CreateHospitalView(props: PublicProps): JSX.Element {
  const [hospital, setHospital] = useState(defaultHospital);
  const [loadingState, setLoadingState] = useState({
    loading: false,
    loaded: false,
    attempt: false,
  });

  const getHospitalValidationErrors = (): string[] => {
    return validateHospital(hospital);
  };

  const canCreate = (): boolean =>
    !loadingState.loading && !loadingState.loaded && getHospitalValidationErrors().length === 0;

  const create = (e: FormEvent<HTMLFormElement>): void => {
    // Prevent the default, so we don't get a page reload
    e.preventDefault();

    // Don't allow spammy clicking to submit this form twice
    if (!canCreate()) return;

    // Transition to the "creating" state so that we don't get additional submits
    setLoadingState({ loading: true, attempt: true, loaded: false });

    try {
      // No need to store this ref since we didn't register any listeners
      firebase.database().ref('hospitals').push(hospital);

      // Transition out of the "creating" state so that the form opens again
      setLoadingState({ loading: false, attempt: true, loaded: true });

      props.history.push(`/hospitals${props.location.search}`);
    } catch (e) {
      console.error(e);
      // Transition out of the "creating" state so that the form opens again
      setLoadingState({ loading: false, attempt: true, loaded: false });
    }
  };

  return (
    <ProtectedRoute>
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
                  <form onSubmit={create}>
                    <HospitalInput initialValue={hospital} onChange={setHospital} />
                    {loadingState.attempt && (
                      <>
                        <ul>
                          {getHospitalValidationErrors().map((error) => (
                            <li key={error}>{error}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    <Box pa={1}>
                      <Button type="submit" disabled={!canCreate()}>
                        Create
                      </Button>
                    </Box>
                  </form>
                </Card>
              </Col>
            </Row>
          </Container>
        </Box>
      </>
    </ProtectedRoute>
  );
}
