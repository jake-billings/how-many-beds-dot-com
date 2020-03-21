import React from 'react'
import styled from 'styled-components'
import { Row, Col } from 'react-grid-system'

import { colors } from './variables'
import Box from './Box'
import { Flex, Grow } from './Flex'

import { HospitalForUI } from '../types'
import HospitalUtilizationChart from './HospitalUtilizationChart'
import { Link } from 'react-router-dom'
import Container from './Container'

const StyledHospitalCard = styled.div`
  background-color: ${colors.white};
  border: solid 1px ${colors.snow};
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 16px;
`

const StyledCardHeader = styled.h3`
  color: ${colors.black};
  font-size: 20px;
  font-weight: 500;
`

const StyledCardByline = styled.p`
  color: ${colors.gray};
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
`

const StyledStatisticValue = styled.h3<{ primary?: boolean }>`
  color: ${({ primary }) => primary ? colors.green : colors.black};
  font-size: 20px;
`

const StyledStatisticByline = styled.p`
  color: ${colors.gray};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
`

const StyledCardLink = styled.a`
  color: ${colors.blue};
  cursor: pointer;
  text-decoration: none;
`

type HospitalCardProps = {
  hospital: HospitalForUI,
  editHospitalLink: string | false
}

const GOOGLE_MAPS_URL = 'https://www.google.com/maps/dir/?api=1'

const generateDirectionsUrl = (hospital: HospitalForUI): string =>
  `${GOOGLE_MAPS_URL}&destination=${hospital.name}&destination_place_id=${hospital.location.googleMapsPlaceId}`

const HospitalCard: React.SFC<HospitalCardProps> = ({ hospital, editHospitalLink }) => (
  <StyledHospitalCard>
    <Flex>
      <div>
        <Box mb={.5}>
          <StyledCardHeader>{hospital.name}</StyledCardHeader>
        </Box>
        <StyledCardByline>{hospital.location.address}</StyledCardByline>
      </div>
      <Grow/>
      {hospital.distanceMiles && <StyledCardByline>{hospital.distanceMiles.toFixed(2)} miles</StyledCardByline>}
    </Flex>
    <Row align="center">
      <Col xs={8}>
        <HospitalUtilizationChart
          hospital={hospital}
        />
      </Col>
      <Col xs={4}>
        <Box mb={1}>
          <Box mb={0.5}>
            <StyledStatisticValue primary>{hospital.totalBedCount - hospital.occupiedBedCount}</StyledStatisticValue>
          </Box>
          <StyledStatisticByline>available</StyledStatisticByline>
        </Box>
        <Box>
          <Box mb={0.5}>
            <StyledStatisticValue>{hospital.totalBedCount}</StyledStatisticValue>
          </Box>
          <StyledStatisticByline>total</StyledStatisticByline>
        </Box>
      </Col>
    </Row>
    <Box mt={3}>
      <Flex>
        {editHospitalLink && (

          <Link to={editHospitalLink} style={{textDecoration: 'none'}}>
            <StyledCardLink>
              Edit
            </StyledCardLink>
          </Link>

        )}
        <Grow/>
        <StyledCardLink
          onClick={() => window.open(generateDirectionsUrl(hospital), '_blank')}
        >Get Directions</StyledCardLink>
      </Flex>
    </Box>
  </StyledHospitalCard>
)

export default HospitalCard
