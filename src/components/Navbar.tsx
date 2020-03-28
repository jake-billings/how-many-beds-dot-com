import React from 'react'
import styled from 'styled-components'
import { Row, Col } from 'react-grid-system'
import { Link } from 'react-router-dom'

import { Location } from '../types'
import { colors } from './variables'
import Container from './Container';
import { Grow } from './Flex'
import LocationSearchInput from './LocationInput'
import SignInOutButton from '../SignInOutButton'

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

const StyledNavLink = styled(Link)`
  color: ${colors.white};
  text-decoration: none;
`;

type NavbarProps = {
  onLocationChange?: (location: Location | null) => void,
  canCreateNewHospital?: boolean,
  searchQuery?: string
}

const Navbar: React.SFC<NavbarProps> = ({
  onLocationChange,
  canCreateNewHospital,
  searchQuery
}) => (
  <StyledNavbar>
    <Container>
      <Row align="center">
        <Col sm={3}>
          <StyledNavbarHeader to="/">
            HowManyBeds.com
          </StyledNavbarHeader>
        </Col>
        {onLocationChange && (
          <Col sm={6}>
            <LocationSearchInput
              initialValue={null}
              onChange={onLocationChange}
              googleMapsSearchOptions={{types: ['(cities)']}}
            />
          </Col>
        )}
        <Grow />
        {canCreateNewHospital && (
          <StyledNavLink to={`/hospitals/new${searchQuery}`}>New Hospital</StyledNavLink>
        )}
        <SignInOutButton/>

      </Row>
    </Container>
  </StyledNavbar>
)

export default Navbar
