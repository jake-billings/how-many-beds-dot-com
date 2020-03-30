import React, { Component } from 'react';
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

/**
 * HospitalInput
 *
 * React Component/Input
 *
 * This component abstracts all of the form fields necessary to edit or create a hospital object.
 *  As a result, we can have a separate component to create and a separte component to edit hospital
 *  objects without duplicating too much code.
 */
class HospitalInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hospital: props.initialValue || {
        name: '',
        location: {
          address: 'asdf',
          googleMapsPlaceId: '',
          lat: 0,
          lng: 0,
        },
        totalBedCount: 0,
        occupiedBedCount: 0,
      },
    };
  }

  /**
   * updateHospitalField
   *
   * composed function
   *
   * returns a function that updates a field with fieldName on the state hospital object
   *
   * Usage:
   *  <NumericInput
   *  type="number"
   *  className="form-control"
   *  placeholder="500"
   *  min={0}
   *  value={this.state.hospital.totalBedCount}
   *  onChange={this.updateHospitalField('totalBedCount')}
   *  />
   *
   * Notice that onChange typically accepts a function - not a functino call. That's because we return the
   *  function to call to perform the update.
   */
  updateHospitalField = (fieldName: string) => (val: any) => {
    this.setState((state) => {
      const hospital = { ...state.hospital } as any;
      hospital[fieldName] = val;
      this.props.onChange(hospital);
      return { hospital };
    });
  };

  /**
   * updateHospitalFieldWithEvent
   *
   * composed function
   *
   * returns a function that updates a field with fieldName on the state hospital object after receiving an HTML event
   *
   * VERY similar to updateHospitalField but works directly with input objects that send native events
   *
   * Usage:
   *  <input type="text"
   *   className="form-control"
   *   placeholder="Medical facilities name"
   *   value={this.state.hospital.name}
   *   onChange={this.updateHospitalFieldWithEvent('name')}
   *  />
   *
   * Notice that onChange typically accepts a function - not a functino call. That's because we return the
   *  function to call to perform the update.
   */
  updateHospitalFieldWithEvent = (fieldName: string) => (e: any) => {
    const val = e.target.value;
    this.setState((state) => {
      const hospital = { ...state.hospital } as any;
      hospital[fieldName] = val;
      this.props.onChange(hospital);
      return { hospital };
    });
  };

  render() {
    return (
      <Box pa={1}>
        <Box mb={3}>
          <Row>
            <Col sm={6}>
              <InputLabel>Name</InputLabel>
              <Input
                type="text"
                placeholder="Medical facilities name"
                value={this.state.hospital.name}
                onChange={this.updateHospitalFieldWithEvent('name')}
              />
            </Col>
            <Col sm={6}>
              <InputLabel>Address</InputLabel>
              <LocationInput
                inverse
                initialValue={this.state.hospital.location}
                onChange={this.updateHospitalField('location')}
                googleMapsSearchOptions={{}}
              />
            </Col>
          </Row>
        </Box>
        <Row>
          <Col sm={6}>
            <InputLabel>Total Bed Count</InputLabel>
            <StyledNumericInput
              type="number"
              placeholder="500"
              min={0}
              value={this.state.hospital.totalBedCount}
              onChange={this.updateHospitalField('totalBedCount')}
            />
          </Col>
          <Col sm={6}>
            <InputLabel>Occupied Bed Count</InputLabel>
            <StyledNumericInput
              type="number"
              placeholder="0"
              min={0}
              max={this.state.hospital.totalBedCount}
              value={this.state.hospital.occupiedBedCount}
              onChange={this.updateHospitalField('occupiedBedCount')}
            />
          </Col>
        </Row>
      </Box>
    );
  }
}

export default HospitalInput;
