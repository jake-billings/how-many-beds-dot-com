import React from 'react'
import styled from 'styled-components'
import { Row, Col } from 'react-grid-system'

import { Location } from '../types'
import { colors } from './variables'
import Container from './Container';
import LocationSearchInput from './LocationInput';

const StyledNavbar = styled.div`
  align-items: center;
  background-color: ${colors.blue};
  display: flex;
  height: 60px;
  z-index: -1;
`;

const StyledNavbarHeader = styled.h3`
  color: ${colors.white};
  font-size: 16px;
  font-weight: 700;
`;

type NavbarProps = {
  onLocationChange: (location: Location | null) => void
}

const Navbar: React.SFC<NavbarProps> = ({ onLocationChange }) => (
  <StyledNavbar>
    <Container>
      <Row>
        <Col sm={3}>
          <StyledNavbarHeader>
            HowManyBeds.com
          </StyledNavbarHeader>
        </Col>
        <Col sm={6}>
          <LocationSearchInput
            initialValue={null}
            onChange={onLocationChange}
            googleMapsSearchOptions={{}}
          />
        </Col>
      </Row>
    </Container>
  </StyledNavbar>
)

export default Navbar
