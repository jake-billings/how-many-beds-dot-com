import React from 'react'
import { Hospital } from '../types'
import { VictoryPie } from 'victory'
import { colors } from './variables'

type PublicProps = {
  hospital: Hospital
}

/**
 * HospitalUtilizationChart
 *
 * React component
 *
 * This component accepts a Hospital object in props and draws a doughnut chart representing how fully it is used.
 *  This is a small wrapper around VictoryChart.
 */
const HospitalUtilizationChart: React.SFC<PublicProps> = ({ hospital }) => (
  <VictoryPie
    data={[
      { x: 'Used', y: hospital.occupiedBedCount },
      { x: 'Free', y: hospital.totalBedCount - hospital.occupiedBedCount },
    ]}
    innerRadius={90}
    colorScale={[colors.snow, colors.green]}
  />
)

export default HospitalUtilizationChart
