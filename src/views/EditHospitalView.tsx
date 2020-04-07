import React, { useState, FormEvent, useEffect } from 'react';
import { RouteComponentProps, Redirect } from 'react-router';
import { Row, Col } from 'react-grid-system';

import Navbar from '../components/Navbar';
import { Header1, Text } from '../components/ui/type';
import Container from '../components/ui/Container';
import Box from '../components/ui/Box';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

import { validateHospital, Hospital } from '../types';
import HospitalInput from '../components/HospitalInput';
import firebase from '../firebase';
import { ProtectedRoute } from '../providers/FirebaseAuth';

type PublicProps = RouteComponentProps & {
  match: {
    params: {
      hospitalId: string;
    };
  };
};

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

export default function EditHospitalView(props: PublicProps): JSX.Element {
  const [hospital, setHospital] = useState<Hospital>(defaultHospital);
  const [stateErrors, setStateErrors] = useState(false);
  const [loadingState, setLoadingState] = useState({
    loading: false,
    loaded: false,
    attempt: false,
    saving: false,
  });

  let ref: firebase.database.Reference | null = null;

  useEffect(() => {
    setLoadingState({ loading: true, loaded: false, attempt: true, saving: false });

    if (!props.match.params.hospitalId) {
      setStateErrors(true);
      return;
    }

    ref = firebase.database().ref(`hospitals/${props.match.params.hospitalId}`);
    ref.on('value', (ref) => {
      const val = ref.val();
      setHospital(val);
      setLoadingState({
        loading: false,
        loaded: !!val,
        attempt: true,
        saving: false,
      });
    });

    return (): void => {
      if (ref) ref.off();
    };
  }, []);

  const getHospitalValidationErrors = (): string[] => {
    return validateHospital(hospital);
  };

  const canSave = (): boolean =>
    !loadingState.loading && loadingState.loaded && !loadingState.saving && getHospitalValidationErrors().length === 0;

  const save = (e: FormEvent<HTMLFormElement>): void => {
    // Prevent the default, so we don't get a page reload
    e.preventDefault();

    // Don't allow spammy clicking to submit this form twice
    if (!canSave()) return;

    // Transition to the "saving" state so that we don't get additional saves at the same time
    setLoadingState({ ...loadingState, saving: true });

    const ref = firebase.database().ref(`hospitals/${props.match.params.hospitalId}`);

    try {
      ref.set(hospital);

      //Navigate back to the hospital view whilst preserving the query string
      // We navigate back as a UX decision
      // The query string contains (or doesn't contain) the admin parameter and we want to maintain this state,
      //  so we pass it
      props.history.push(`/hospitals${props.location.search}`);

      // Transition out of the "creating" state so that the form opens again
      setLoadingState({ ...loadingState, saving: false });
    } catch (e) {
      console.error(e);
      // Transition out of the "creating" state so that the form opens again
      setLoadingState({ ...loadingState, saving: false });
    }
  };

  return (
    <ProtectedRoute>
      <>
        {stateErrors && <Redirect to="/" />}
        <Navbar />
        <Box mv={5}>
          <Container>
            <Row>
              <Col sm={8} offset={{ sm: 2 }}>
                <Box mb={2}>
                  <Header1>Edit Hospital</Header1>
                </Box>
                <Card>
                  {loadingState.loading && <Text>Loading...</Text>}
                  {!loadingState.loading && !loadingState.loaded && <Text>Problem loading</Text>}
                  {loadingState.loaded && (
                    <div>
                      <form onSubmit={save}>
                        <HospitalInput initialValue={hospital} onChange={setHospital} />
                        {getHospitalValidationErrors().length > 0 && (
                          <Box pv={2} ph={1}>
                            <ul style={{ listStylePosition: 'inside' }}>
                              {getHospitalValidationErrors().map((error) => (
                                <li key={error}>{error}</li>
                              ))}
                            </ul>
                          </Box>
                        )}
                        <Box pa={1}>
                          <Button type="submit" disabled={!canSave()}>
                            Save
                          </Button>
                        </Box>
                      </form>
                    </div>
                  )}
                </Card>
              </Col>
            </Row>
          </Container>
        </Box>
      </>
    </ProtectedRoute>
  );
}
