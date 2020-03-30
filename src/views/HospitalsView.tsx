import React, { useState, useEffect, useContext } from 'react';
import firebase from '../firebase';
import { Location, HospitalForUI, Hospital } from '../types';
import { getDistance } from 'geolib';
import { Row, Col } from 'react-grid-system';

import { RouteComponentProps } from 'react-router-dom';
import HospitalCard from '../components/HospitalCard';
import Box from '../components/ui/Box';
import Container from '../components/ui/Container';
import Navbar from '../components/Navbar';
import HospitalMap from '../components/HospitalMap';
import { FirebaseAuthContext } from '../providers/FirebaseAuth';

type PublicProps = RouteComponentProps;

export default function HospitalsView(props: RouteComponentProps): JSX.Element {
  const [loadingState, setLoadingState] = useState({
    loading: false,
    loaded: false,
  });
  const [hospitals, setHospitals] = useState<HospitalForUI[]>([]);
  const [loc, setLocation] = useState<Location | null>(null);
  const { user } = useContext(FirebaseAuthContext);

  let hospitalRef: firebase.database.Reference | null = null;

  useEffect(() => {
    setLoadingState({ ...loadingState, loading: true });

    //Setup our firebase database reference
    hospitalRef = firebase.database().ref('hospitals');

    //Add a listener (unregistered in componentWillUnmount)
    hospitalRef.on('value', (snapshot) => {
      const val = snapshot.val();

      let hospitals: HospitalForUI[];
      if (val) {
        hospitals = Object.keys(val).map((key) => {
          return {
            id: key,
            ...val[key],
          };
        }) as HospitalForUI[];
      } else {
        hospitals = [];
      }

      setLoadingState({ ...loadingState, loading: false, loaded: true });
      setHospitals(hospitals);
    });

    return (): void => {
      if (hospitalRef) hospitalRef.off();
    };
  }, []);

  const deleteHospitalById = (id: string): void => {
    firebase.database().ref(`hospitals/${id}`).remove();
  };

  const canEdit = (id: string): boolean => (user && (user.editorOf === id || user.isAdmin)) || false;

  const getHospitals = (): HospitalForUI[] => {
    // If there's no selected location, just return the list of hospitals.
    if (!loc) return hospitals;

    // Otherwise, we know we have a location
    const location: Location = (loc as unknown) as Location;

    // Map and order here
    return hospitals
      .map((hospital) => {
        return {
          ...hospital,

          // getDistance from geolib returns distance in meters
          // we want distance in miles
          // There are 0.000621371 miles per meter
          // So run the conversion right here
          distanceMiles:
            0.000621371 *
            getDistance(
              {
                latitude: location.lat,
                longitude: location.lng,
              },
              {
                latitude: hospital.location.lat,
                longitude: hospital.location.lng,
              },
            ),
        };
      })
      .sort((a, b) => {
        return a.distanceMiles - b.distanceMiles;
      });
  };

  const canCreateHospital = (): boolean => user?.isAdmin || false;

  return (
    <>
      <Navbar
        onLocationChange={(location): void => {
          setLocation(location);
        }}
        canCreateNewHospital={canCreateHospital()}
        searchQuery={props.location.search}
      />
      <Container>
        {loadingState.loading && <p>Loading...</p>}
        <Box mv={5}>
          <Row>
            <Col md={8}>
              <Row>
                {getHospitals().map((hospital) => (
                  <Col sm={6} key={hospital.id}>
                    <Box mb={3}>
                      <HospitalCard
                        hospital={hospital}
                        editHospitalLink={
                          canEdit(hospital.id) ? `/hospitals/${hospital.id}${props.location.search}` : undefined
                        }
                        canDeleteHospital={canEdit(hospital.id)}
                        onDeleteHospital={(): void => deleteHospitalById(hospital.id)}
                      />
                    </Box>
                  </Col>
                ))}
              </Row>
            </Col>
            <Col md={4}>
              <HospitalMap location={loc} hospitals={hospitals} />
            </Col>
          </Row>
        </Box>
      </Container>
    </>
  );
}
