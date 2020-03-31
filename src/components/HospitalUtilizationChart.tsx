import React from 'react';

import { colors } from './ui/variables';

import { HospitalForUI } from '../types';

import { VictoryPie } from 'victory';

type HospitalUtilizationChartProps = {
  hospital: HospitalForUI;
};

export default function HospitalCard({ hospital }: HospitalUtilizationChartProps): JSX.Element {
  return (
    <VictoryPie
      data={[
        { x: 'Beds Occupied', y: hospital.capacityPercent },
        { x: 'Capacity', y: 100 - hospital.capacityPercent },
      ]}
      innerRadius={90}
      colorScale={[colors.snow, colors.green]}
    />
  );
}
