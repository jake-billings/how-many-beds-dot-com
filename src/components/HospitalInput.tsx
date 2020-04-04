import 'rc-slider/assets/index.css';

import React, { useState, ChangeEvent } from 'react';
import { Row, Col } from 'react-grid-system';

import LocationInput from './LocationInput';
import { Input, InputLabel } from './ui/Input';
import Box from './ui/Box';

import { Hospital } from '../types';
import { Text } from './ui/type';
import { Flex } from './Flex';
import Slider from 'rc-slider';
import { colors } from './ui/variables';
import Checkbox from './ui/Checkbox';

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
  capacityPercent: 50,
  isCovidCenter: false,
  sharingCovidPatientCount: false,
  covidPatientCount: 0,
  covidCapableBedCount: 0,
  icuCovidCapableBedCount: 0,
  ventilatorCount: 0,
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

  const updateHospitalFieldWithEvent = (fieldName: string, num = false) => (e: ChangeEvent<HTMLInputElement>): void => {
    const val = num && e?.target?.value ? +e?.target?.value.replace(/\+|-/, '') : e?.target?.value;
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
            <InputLabel>Overall Hospital Utilization {hospital.capacityPercent}%</InputLabel>
            <Slider
              value={hospital.capacityPercent}
              onChange={updateHospitalField('capacityPercent')}
              trackStyle={{ backgroundColor: colors.blue }}
              handleStyle={{ borderColor: colors.blue }}
              min={0}
              max={100}
              defaultValue={50}
            />
          </Box>
        </Col>
        <Col sm={6}>
          <Box mb={3}>
            <InputLabel>Phone</InputLabel>
            <Input
              type="text"
              placeholder="212-555-1234"
              value={hospital.phone}
              onChange={updateHospitalFieldWithEvent('phone')}
            />
          </Box>
        </Col>
        <Col sm={6}>
          <Box mb={1}>
            <InputLabel>
              <Flex center>
                <Box mr={1}>
                  <Checkbox
                    checked={hospital.isCovidCenter}
                    onChange={(): void => {
                      updateHospitalField('isCovidCenter')(!hospital.isCovidCenter);
                    }}
                  />
                </Box>
                Advertise this hospital as a COVID Center
              </Flex>
            </InputLabel>
          </Box>
        </Col>
        <Col sm={6}>
          <Box mb={3}>
            <Text>By advertising this hospital as a covid center, it will receive priority ranking.</Text>
          </Box>
        </Col>
        <Col sm={6}>
          <Box mb={2}>
            <InputLabel>
              <Flex center>
                <Box mr={1}>
                  <Checkbox
                    checked={hospital.sharingCovidPatientCount}
                    onChange={(): void => {
                      updateHospitalField('sharingCovidPatientCount')(!hospital.sharingCovidPatientCount);
                    }}
                  />
                </Box>
                Share Number of COVID Patients
              </Flex>
            </InputLabel>
          </Box>
          {hospital.sharingCovidPatientCount && (
            <Box mb={3}>
              <InputLabel>COVID Patient Count</InputLabel>
              <Input
                type="text"
                value={hospital.covidPatientCount}
                onChange={updateHospitalFieldWithEvent('covidPatientCount')}
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
          <Box mb={2}>
            <InputLabel>COVID Floor Beds Available</InputLabel>
            <Input
              type="text"
              value={hospital.covidCapableBedCount}
              onChange={updateHospitalFieldWithEvent('covidCapableBedCount', true)}
            />
          </Box>
        </Col>
        <Col sm={6}>
          <Box mb={3}>
            <Text>placeholder helper text</Text>
          </Box>
        </Col>
        <Col sm={6}>
          <Box mb={2}>
            <InputLabel>ICU COVID Beds Available</InputLabel>
            <Input
              type="text"
              value={hospital.icuCovidCapableBedCount}
              onChange={updateHospitalFieldWithEvent('icuCovidCapableBedCount', true)}
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
            <InputLabel>Ventilators Available</InputLabel>
            <Input
              type="text"
              value={hospital.ventilatorCount}
              onChange={updateHospitalFieldWithEvent('ventilatorCount', true)}
            />
          </Box>
        </Col>
      </Row>
    </Box>
  );
}
