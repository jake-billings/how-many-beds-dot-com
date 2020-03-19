import React, { Component } from 'react'
import { Hospital } from './types'
import { VictoryPie } from 'victory'

type PublicProps = {
  hospital: Hospital
}

type State = {}

/**
 * HospitalUtilizationChart
 *
 * React component
 *
 * This component accepts a Hospital object in props and draws a doughnut chart representing how fully it is used.
 *  This is a small wrapper around VictoryChart.
 */
class HospitalUtilizationChart extends Component<PublicProps, State> {

  render = () => (
    <>
      <VictoryPie
        data={[
          { x: 'Used', y: this.props.hospital.occupiedBedCount },
          { x: 'Free', y: this.props.hospital.totalBedCount - this.props.hospital.occupiedBedCount },
        ]}
        innerRadius={90}
      />
    </>
  )
}

export default HospitalUtilizationChart
