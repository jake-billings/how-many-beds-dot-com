import React, { useState, ChangeEvent } from 'react';
import { Row, Col } from 'react-grid-system';

import LocationInput from './LocationInput';
import { Input, InputLabel, StyledNumericInput } from './ui/Input';
import Box from './ui/Box';

import { Hospital } from '../types';
import { Text } from './ui/type';
import { Flex } from './Flex';

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
    address: '',
    googleMapsPlaceId: '',
    lat: 0,
    lng: 0,
  },
  phone: '',
  isCovidCenter: false,
  sharingCovidPatientCount: false,
  covidPatientCount: 0,
  covidCapableBedCount: 0,
  icuCovidCapableBedCount: 0,
  ventilatorCount: 0,
};

export default function HospitalInput({ initialValue, onChange }: Props): JSX.Element {
  const [hospital, setHospital] = useState(defaultHospital);

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
              type="text"
              placeholder="1234567890"
              value={hospital.phone}
              onChange={updateHospitalFieldWithEvent('phone')}
            />
          </Box>
        </Col>
        <Col sm={6}>
          <Box mb={1}>
            <Flex center>
              <Box mr={1}>
                <input
                  type="checkbox"
                  checked={hospital.isCovidCenter}
                  onChange={(): void => {
                    updateHospitalField('isCovidCenter')(!hospital.isCovidCenter);
                  }}
                />
              </Box>
              <InputLabel>
                Advertise this hospital as a <i>Covid Center</i>
              </InputLabel>
            </Flex>
          </Box>
        </Col>
        <Col sm={6}>
          <Box mb={3}>
            <Text>By advertising this hospital as a covid center, it will receive priority ranking.</Text>
          </Box>
        </Col>
        <Col sm={6}>
          <Box mb={1}>
            <Flex center>
              <Box mr={1}>
                <input
                  type="checkbox"
                  checked={hospital.sharingCovidPatientCount}
                  onChange={(): void => {
                    updateHospitalField('sharingCovidPatientCount')(!hospital.sharingCovidPatientCount);
                  }}
                />
              </Box>
              <InputLabel>Share Number of COVID Patients</InputLabel>
            </Flex>
          </Box>
          {hospital.sharingCovidPatientCount && (
            <Box mb={11}>
              <InputLabel>Phone</InputLabel>
              <StyledNumericInput
                type="number"
                placeholder="500"
                min={0}
                value={hospital.covidPatientCount}
                onChange={updateHospitalField('covidPatientCount')}
              />
            </Box>
          )}
        </Col>
        <Col sm={6}>
          <Box mb={3}>
            <Text>placeholder helper text</Text>
          </Box>
        </Col>
        <Col sm={6}>
          <Box mb={1}>
            <InputLabel>COVID Capable Beds</InputLabel>
            <StyledNumericInput
              type="number"
              placeholder="500"
              min={0}
              value={hospital.covidCapableBedCount}
              onChange={updateHospitalField('covidCapableBedCount')}
            />
          </Box>
        </Col>
        <Col sm={6}>
          <Box mb={3}>
            <Text>placeholder helper text</Text>
          </Box>
        </Col>
        <Col sm={6}>
          <Box mb={1}>
            <InputLabel>ICU+COVID Capable Beds</InputLabel>
            <StyledNumericInput
              type="number"
              placeholder="500"
              min={0}
              value={hospital.icuCovidCapableBedCount}
              onChange={updateHospitalField('icuCovidCapableBedCount')}
            />
          </Box>
        </Col>
        <Col sm={6}>
          <Box mb={3}>
            <Text>placeholder helper text</Text>
          </Box>
        </Col>
        {(hospital.covidCapableBedCount > 0 || hospital.icuCovidCapableBedCount > 0) && (
          <Col sm={12}>
            <Box mb={3}>
              <Text>
                Total COVID Beds: <b>{hospital.covidCapableBedCount + hospital.icuCovidCapableBedCount}</b>
              </Text>
            </Box>
          </Col>
        )}
        <Col sm={6}>
          <Box mb={1}>
            <InputLabel>Ventilators</InputLabel>
            <StyledNumericInput
              type="number"
              placeholder="500"
              min={0}
              value={hospital.ventilatorCount}
              onChange={updateHospitalField('ventilatorCount')}
            />
          </Box>
        </Col>
      </Row>
    </Box>
  );
}
