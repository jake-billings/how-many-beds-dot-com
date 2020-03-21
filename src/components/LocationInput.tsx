import React, { Component } from 'react'
import styled from 'styled-components'

import { colors, fontFamily } from './variables'
import { Location } from '../types'

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete'

const StyledLocationInputWrapper = styled.div`
  width: 100%;
`

const StyledLocationInput = styled.input`
  background-color: rgba(255, 255, 255, .2);
  border: none;
  border-radius: 8px;
  color: ${colors.white};
  font-family: ${fontFamily};
  font-size: 16px;
  padding: 8px 16px;
  width: 100%;
  &:focus {
    background-color: rgba(255, 255, 255, .4);
    outline: none;
  }
  ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: rgba(255, 255, 255, 0.7);
    opacity: 1; /* Firefox */
  }
  :-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: rgba(255, 255, 255, 0.7);
  }
  ::-ms-input-placeholder { /* Microsoft Edge */
    color: rgba(255, 255, 255, 0.7);
  }
`

const StyledLocationOptions = styled.div`
  background-color: ${colors.white};
  border: none;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 8px;
  position: absolute;
  width: 100%;
  z-index: 9999;
`

const StyledLocationOption = styled.p`
  border-radius: 8px;
  color: ${colors.black};
  padding: 8px;
  cursor: pointer;
`

type Props = {
  initialValue: Location | null
  onChange: (location: Location | null) => void,
  googleMapsSearchOptions: any
}

type State = {
  address: string,
}

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
class LocationSearchInput extends Component<Props, State> {
  constructor (props: Props) {
    super(props)
    if (props.initialValue) {
      this.state = { address: props.initialValue.address }
    } else {
      this.state = {address: ''}
    }
  }

  handleChange = (address: string) => {
    this.setState({ address })
    this.props.onChange(null)
  }

  handleSelect = (address: string) => {
    this.setState({ address })

    let googleMapsPlaceId: string
    geocodeByAddress(address)
      .then(results => {
        googleMapsPlaceId = results[0].place_id
        return getLatLng(results[0])
      })
      .then(latLng => {
        let location: Location = {
          address: address,
          googleMapsPlaceId,
          lat: latLng.lat,
          lng: latLng.lng,
        }

        this.props.onChange(location)
      })
      .catch((error: string) => {
        console.error('Error geocoding address', error)
        this.props.onChange(null)
      })
  }

  render () {
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        searchOptions={this.props.googleMapsSearchOptions}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <StyledLocationInputWrapper>
            <StyledLocationInput
              {...getInputProps({
                placeholder: 'Search Places ...',
              })}
            />
            {(loading || suggestions.length > 0) && (
              <StyledLocationOptions>
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item'
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: '#eceef0', cursor: 'pointer' }
                    : { backgroundColor: '#ffffff', cursor: 'pointer' }
                  return (
                    <StyledLocationOption
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                    >
                      {suggestion.description}
                    </StyledLocationOption>
                  )
                })}
              </StyledLocationOptions>
            )}
          </StyledLocationInputWrapper>
        )}
      </PlacesAutocomplete>
    )
  }
}

export default LocationSearchInput
