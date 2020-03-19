import React, { Component } from 'react'

import { Location } from './types'

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete'

type Props = {
  initialValue: Location
  onChange: (location: Location | null) => void,
  googleMapsSearchOptions: any
}

type State = {
  address: string,
}

class LocationSearchInput extends Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = { address: props.initialValue.address }
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
          <div>
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'form-control',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item'
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' }
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    )
  }
}

export default LocationSearchInput
