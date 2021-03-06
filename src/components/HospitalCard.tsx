import React, { MouseEvent } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-grid-system';
import { Link } from 'react-router-dom';

import { colors, fontFamily } from './ui/variables';
import Box from './ui/Box';
import { Flex, Grow } from './Flex';
import Card from './ui/Card';
import { Header3 } from './ui/type';

import { HospitalForUI } from '../types';

import HospitalUtilizationChart from './HospitalUtilizationChart';

const StyledCardByline = styled.p`
  color: ${colors.gray};
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
`;

const StyledStatisticValue = styled.h3<{ primary?: boolean }>`
  color: ${({ primary }): string => (primary ? colors.green : colors.black)};
  font-size: 20px;
  font-weight: 400;
`;

const StyledStatisticByline = styled.p`
  color: ${colors.gray};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
`;

const StyledCardLink = styled.a`
  color: ${colors.blue};
  cursor: pointer;
  text-decoration: none;
`;

const StyledCardLinkButton = styled.button`
  border: none;
  color: ${colors.blue};
  cursor: pointer;
  font-family: ${fontFamily};
  font-size: 16px;
  text-decoration: none;
`;

type HospitalCardProps = {
  hospital: HospitalForUI;
  editHospitalLink?: string;
  onDeleteHospital?: (e: MouseEvent<HTMLButtonElement>) => void;
  canDeleteHospital?: boolean;
};

const GOOGLE_MAPS_URL = 'https://www.google.com/maps/dir/?api=1';

const generateDirectionsUrl = (hospital: HospitalForUI): string =>
  `${GOOGLE_MAPS_URL}&destination=${hospital.name}&destination_place_id=${hospital.location.googleMapsPlaceId}`;

export default function HospitalCard({
  hospital,
  editHospitalLink,
  onDeleteHospital,
  canDeleteHospital,
}: HospitalCardProps): JSX.Element {
  return (
    <Card style={{ height: 'calc(100% - 34px)' }}>
      <Flex column style={{ height: '100%' }}>
        <Box mb={2}>
          <Flex>
            <div>
              <Box mb={0.5}>
                <Header3>{hospital.name}</Header3>
              </Box>
              <StyledCardByline>{hospital.location.address}</StyledCardByline>
              {hospital.isCovidCenter && <StyledCardByline>COVID CENTER</StyledCardByline>}
            </div>
            <Grow />
            {hospital.distanceMiles && <StyledCardByline>{hospital.distanceMiles.toFixed(2)} miles</StyledCardByline>}
          </Flex>
        </Box>
        <Row align="center">
          <Col xs={2} />
          <Col xs={8}>
            <HospitalUtilizationChart hospital={hospital} />
          </Col>
          <Col xs={6}>
            <Box mb={2}>
              <Box mb={0.5}>
                <StyledStatisticValue primary>{hospital.covidCapableBedCount}</StyledStatisticValue>
              </Box>
              <StyledStatisticByline>COVID Floor Beds Available</StyledStatisticByline>
            </Box>
          </Col>
          <Col xs={6}>
            <Box mb={2}>
              <Box mb={0.5}>
                <StyledStatisticValue primary>{hospital.icuCovidCapableBedCount}</StyledStatisticValue>
              </Box>
              <StyledStatisticByline>COVID ICU Beds Available</StyledStatisticByline>
            </Box>
          </Col>
          <Col xs={6}>
            <Box mb={2}>
              <Box mb={0.5}>
                <StyledStatisticValue>{hospital.ventilatorCount}</StyledStatisticValue>
              </Box>
              <StyledStatisticByline>Ventilators Available</StyledStatisticByline>
            </Box>
          </Col>
          {hospital.sharingCovidPatientCount && (
            <Col xs={6}>
              <Box mb={2}>
                <Box mb={0.5}>
                  <StyledStatisticValue>{hospital.covidPatientCount}</StyledStatisticValue>
                </Box>
                <StyledStatisticByline>COVID patients</StyledStatisticByline>
              </Box>
            </Col>
          )}
          <Col xs={12}>
            <Box mb={2}>
              <Box mb={0.5}>
                <StyledStatisticValue>{hospital.phone}</StyledStatisticValue>
              </Box>
              <StyledStatisticByline>COVID Access Line</StyledStatisticByline>
            </Box>
          </Col>
        </Row>
        <Grow />
        <Box mt={3} style={{ width: '100%' }}>
          <Flex>
            {editHospitalLink && (
              <Link to={editHospitalLink} style={{ textDecoration: 'none', marginRight: '15px' }}>
                <StyledCardLink>Edit</StyledCardLink>
              </Link>
            )}
            {canDeleteHospital && <StyledCardLinkButton onClick={onDeleteHospital}>Delete</StyledCardLinkButton>}
            <Grow />
            <StyledCardLinkButton
              onClick={(): void => {
                window.open(generateDirectionsUrl(hospital), '_blank');
              }}
            >
              Get Directions
            </StyledCardLinkButton>
          </Flex>
        </Box>
      </Flex>
    </Card>
  );
}
