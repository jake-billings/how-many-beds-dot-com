import React, { Component, useState, ChangeEvent } from 'react';
import { Row, Col } from 'react-grid-system';

import LocationInput from './LocationInput';
import { Input, InputLabel, StyledNumericInput } from './ui/Input';
import Box from './ui/Box';

import { Hospital } from '../types';

type Props = {
  initialValue: Hospital | null;
  onChange: (hospital: Hospital) => void;
};

type State = {
  hospital: Hospital;
};

const defaultHospital = {
  name: '',
  location: {
    address: 'asdf',
    googleMapsPlaceId: '',
    lat: 0,
    lng: 0,
  },
  totalBedCount: 0,
  occupiedBedCount: 0,
};

export default function HospitalInput({ initialValue, onChange }: Props): JSX.Element {
  const [hospital, setHospital] = useState(initialValue || defaultHospital);

  const updateHospitalField = (fieldName: string) => (val: any): void => {
    setHospital((h) => {
      const hospital = { ...h } as any;
      hospital[fieldName] = val;
      onChange(hospital);
      return hospital;
    });
  };

  const updateHospitalFieldWithEvent = (fieldName: string) => (e: ChangeEvent<HTMLInputElement>): void => {
    const val = e?.target?.value;
    if (!val) return;
    setHospital((h) => {
      const hospital = { ...h } as any;
      hospital[fieldName] = val;
      onChange(hospital);
      return hospital;
    });
  };

  return (
    <Box pa={1}>
      <Row>
        <Col sm={6}>
          <Box mb={3}>
            <InputLabel>Name</InputLabel>
            <Input
              type="text"
              placeholder="Medical facilities name"
              value={hospital.name}
              onChange={updateHospitalFieldWithEvent('name')}
            />
          </Box>
        </Col>
        <Col sm={6}>
          <Box mb={3}>
            <InputLabel>Address</InputLabel>
            <LocationInput
              inverse
              initialValue={hospital.location}
              onChange={updateHospitalField('location')}
              googleMapsSearchOptions={{}}
            />
          </Box>
        </Col>
        <Col sm={6}>
          <Box mb={3}>
            <InputLabel>Overall Hospital Utilization</InputLabel>
          </Box>
        </Col>
        <Col sm={6}>
          <Box mb={3}>
            <InputLabel>Phone</InputLabel>
            <Input
              type="phone"
              placeholder="1234567890"
              value={hospital.phone}
              onChange={updateHospitalFieldWithEvent('phone')}
            />
          </Box>
        </Col>
        <Col sm={6}>
          <input type="checkbox" checked={hospital.isCovidCenter} />
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <InputLabel>Total Bed Count</InputLabel>
          <StyledNumericInput
            type="number"
            placeholder="500"
            min={0}
            value={hospital.totalBedCount}
            onChange={updateHospitalField('totalBedCount')}
          />
        </Col>
        <Col sm={6}>
          <InputLabel>Occupied Bed Count</InputLabel>
          <StyledNumericInput
            type="number"
            placeholder="0"
            min={0}
            max={hospital.totalBedCount}
            value={hospital.occupiedBedCount}
            onChange={updateHospitalField('occupiedBedCount')}
          />
        </Col>
      </Row>
    </Box>
  );
}
