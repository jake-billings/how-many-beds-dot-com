import React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-grid-system';
import { Link } from 'react-router-dom';

import { Location } from '../types';
import { colors } from './ui/variables';
import Container from './ui/Container';
import { Grow } from './Flex';
import { StyledNavLink } from './ui/type';
import LocationSearchInput from './LocationInput';
import AuthStateButton from './AuthStateButton';

const StyledNavbar = styled.div`
  align-items: center;
  background-color: ${colors.blue};
  display: flex;
  height: 60px;
  z-index: -1;
`;

const StyledNavbarHeader = styled(Link)`
  color: ${colors.white};
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;
`;

type NavbarProps = {
  onLocationChange?: (location: Location | null) => void;
  canCreateNewHospital?: boolean;
  searchQuery?: string;
};

export default function Navbar({ onLocationChange, canCreateNewHospital, searchQuery }: NavbarProps): JSX.Element {
  return (
    <StyledNavbar>
      <Container>
        <Row align="center">
          <Col sm={3}>
            <StyledNavbarHeader to="/">HowManyBeds.com</StyledNavbarHeader>
          </Col>
          {onLocationChange && (
            <Col sm={6}>
              <LocationSearchInput
                initialValue={null}
                onChange={onLocationChange}
                googleMapsSearchOptions={{ types: ['(cities)'] }}
              />
            </Col>
          )}
          <Grow />
          {canCreateNewHospital && <StyledNavLink to={`/hospitals/new${searchQuery}`}>New Hospital</StyledNavLink>}
          <AuthStateButton />
        </Row>
      </Container>
    </StyledNavbar>
  );
}
