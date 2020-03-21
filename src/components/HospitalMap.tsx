import React from 'react'

import GoogleMapReact from 'google-map-react'
import { HospitalForUI, Location } from '../types'
import HospitalSvg from '../hospital.svg'

const HospitalMarker = ({ name }: any) => (
  <div>
    <img
      src={HospitalSvg}
      alt='hospital icon'
      style={{width: '25px', height: '25  px'}}
    />
    {name}
  </div>
)

const DEFAULT_LAT_LNG = {
  lat: 39.7392,
  lng: -104.9903,
}

const HospitalMap = ({ hospitals, location }: { hospitals: HospitalForUI[], location: Location | null }) => (
  <>
    <div style={{ height: '100%', width: '100%' }}>
      <GoogleMapReact
        defaultCenter={{
          lat: (location || DEFAULT_LAT_LNG).lat,
          lng: (location || DEFAULT_LAT_LNG).lng,
        }}
        center={{
          lat: (location || DEFAULT_LAT_LNG).lat,
          lng: (location || DEFAULT_LAT_LNG).lng,
        }}
        yesIWantToUseGoogleMapApiInternals
        defaultZoom={10}
      >
        {
          hospitals.map(hospital => (
            <HospitalMarker
              lat={hospital.location.lat}
              lng={hospital.location.lng}
              name={hospital.name}
            />
          ))
        }

      </GoogleMapReact>
    </div>
  </>
)

export default HospitalMap
