import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import firebase from '../firebase';
import { Location, HospitalForUI } from '../types';
import { getDistance } from 'geolib';
import { Row, Col } from 'react-grid-system';

import { RouteComponentProps } from 'react-router-dom';
import HospitalCard from '../components/HospitalCard';
import Box from '../components/ui/Box';
import Navbar from '../components/Navbar';
import HospitalMap from '../components/HospitalMap';
import { FirebaseAuthContext } from '../providers/FirebaseAuth';
import { Text } from '../components/ui/type';
import Banner from '../components/ui/Banner';

type PublicProps = RouteComponentProps;

const RowWrapper = styled(Row)`
  height: calc(100% - 60px);
  overflow: hidden;
`;

const BoxWrapper = styled(Box)`
  overflow-x: hidden;
  @media (max-width: 40em) {
    height: 100%;
    margin: 0 auto;
    width: 90%;
  }
  @media (min-width: 40em) {
    height: 100%;
    margin-left: calc((100vw - 1200px) / 2);
    overflow-y: scroll;
    width: calc(100% - (100vw - 1200px) / 2);
  }
  @media (max-width: 1340px) {
    margin-left: calc(5vw);
    width: 90%;
  }
`;

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
    <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <Banner />
      <Navbar
        onLocationChange={(location): void => {
          setLocation(location);
        }}
        canCreateNewHospital={canCreateHospital()}
        searchQuery={props.location.search}
      />
      {loadingState.loading && <p>Loading...</p>}
      <RowWrapper>
        <Col md={8} style={{ height: '100%' }}>
          <BoxWrapper>
            <Box mt={5}>
              <Text>Currently sourcing {getHospitals().length} hospitals.</Text>
            </Box>
            <Box pt={5} pb={8}>
              <Row>
                {getHospitals().map((hospital) => (
                  <Col sm={6} key={hospital.id} style={{ flexGrow: 1 }}>
                    <Box mb={3} style={{ height: 'calc(100% - 24px)' }}>
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
            </Box>
          </BoxWrapper>
        </Col>
        <Col md={4} style={{ height: '100%' }}>
          <HospitalMap location={loc} hospitals={hospitals} />
        </Col>
      </RowWrapper>
    </div>
  );
}
