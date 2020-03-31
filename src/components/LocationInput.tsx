import React, { useState } from 'react';
import styled from 'styled-components';

import { colors, fontFamily } from './ui/variables';
import { Location } from '../types';

import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

const StyledLocationInputWrapper = styled.div`
  width: 100%;
`;

type StyledLocationProps = {
  inverse?: boolean;
};

const StyledLocationInput = styled.input<StyledLocationProps>`
  background-color: rgba(255, 255, 255, 0.2);
  border: ${({ inverse }): string => (inverse ? `solid 1px ${colors.snow}` : 'none')};
  border-radius: 8px;
  color: ${({ inverse }): string => (inverse ? colors.black : colors.white)};
  font-family: ${fontFamily};
  font-size: 16px;
  padding: 8px 12px;
  width: calc(100% - 24px);
  &:focus {
    background-color: rgba(255, 255, 255, 0.4);
    outline: none;
  }
  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: rgba(255, 255, 255, 0.7);
    opacity: 1; /* Firefox */
  }
  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: rgba(255, 255, 255, 0.7);
  }
  ::-ms-input-placeholder {
    /* Microsoft Edge */
    color: rgba(255, 255, 255, 0.7);
  }
`;

const StyledLocationOptions = styled.div`
  background-color: ${colors.white};
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 8px;
  position: absolute;
  width: calc(100% - 16px);
  z-index: 9999;
`;

const StyledLocationOption = styled.p<{ active: boolean }>`
  background-color: ${({ active }): string => (active ? colors.snow : colors.white)};
  border-radius: 8px;
  color: ${colors.black};
  padding: 8px;
  cursor: pointer;
`;

type Props = {
  initialValue: Location | null;
  onChange: (location: Location | null) => void;
  googleMapsSearchOptions: any;
  inverse?: boolean;
};

type State = {
  address: string;
};

/**
 * LocationSearchInput
 *
 * React component
 *
 * This component displays a textbox for users to enter an address. That address is autocompleted to a valid location
 *  by Google Maps.
 *
 * This component wraps react-places-autocomplete.
 */
export default function LocationSearchInput({
  initialValue,
  onChange,
  googleMapsSearchOptions,
  inverse,
}: Props): JSX.Element {
  const [address, setAddress] = useState(initialValue?.address);

  const handleChange = (a: string): void => {
    setAddress(a);
    onChange(null);
  };

  const handleSelect = (a: string): void => {
    setAddress(a);

    let googleMapsPlaceId: string;
    geocodeByAddress(a)
      .then((results) => {
        googleMapsPlaceId = results[0].place_id;
        return getLatLng(results[0]);
      })
      .then((latLng) => {
        const location: Location = {
          address: a,
          googleMapsPlaceId,
          lat: latLng.lat,
          lng: latLng.lng,
        };

        onChange(location);
      })
      .catch((error: string) => {
        console.error('Error geocoding address', error);
        onChange(null);
      });
  };

  return (
    <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
      searchOptions={googleMapsSearchOptions}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }): JSX.Element => (
        <StyledLocationInputWrapper>
          <StyledLocationInput
            inverse={inverse}
            {...getInputProps({
              placeholder: 'Search Places like New York, New York...',
            })}
          />
          {(loading || suggestions.length > 0) && (
            <StyledLocationOptions>
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion, index) => (
                <StyledLocationOption key={index} active={suggestion.active} {...getSuggestionItemProps(suggestion)}>
                  {suggestion.description}
                </StyledLocationOption>
              ))}
            </StyledLocationOptions>
          )}
        </StyledLocationInputWrapper>
      )}
    </PlacesAutocomplete>
  );
}
