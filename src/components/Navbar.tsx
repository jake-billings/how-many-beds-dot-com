import React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-grid-system';
import { Link } from 'react-router-dom';

import { Location } from '../types';
import { colors } from './ui/variables';
import Container from './ui/Container';
import { Flex, Grow } from './Flex';
import { StyledNavLink } from './ui/type';
import LocationSearchInput from './LocationInput';
import AuthStateButton from './AuthStateButton';
import Box from './ui/Box';

const StyledNavbar = styled.div`
  align-items: center;
  background-color: ${colors.blue};
  display: flex;
  height: 60px;
  z-index: -1;
  @media (max-width: 40em) {
    height: auto;
  }
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
            <Box pv={1}>
              <StyledNavbarHeader to="/">HowManyBeds.com</StyledNavbarHeader>
            </Box>
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
          <Col sm={3}>
            <Flex>
              {canCreateNewHospital && (
                <Box pv={1} mr={3}>
                  <StyledNavLink to={`/hospitals/new${searchQuery}`}>New Hospital</StyledNavLink>
                </Box>
              )}
              <AuthStateButton />
            </Flex>
          </Col>
        </Row>
      </Container>
    </StyledNavbar>
  );
}
