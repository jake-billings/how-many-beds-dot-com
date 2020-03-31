import React from 'react';

import GoogleMapReact from 'google-map-react';
import { HospitalForUI, Location } from '../types';
import HospitalSvg from '../hospital.svg';

type HospitalMarkerProps = {
  name: string;
  lat: number;
  lng: number;
};

function HospitalMarker({ name }: HospitalMarkerProps): JSX.Element {
  return (
    <div>
      <img src={HospitalSvg} alt="hospital icon" style={{ width: '25px', height: '25  px' }} />
      {name}
    </div>
  );
}

const DEFAULT_LAT_LNG = {
  lat: 40.7306,
  lng: -73.9352,
};

type HospitalMapProps = {
  hospitals: HospitalForUI[];
  location: Location | null;
};

export default function HospitalMap({ hospitals, location }: HospitalMapProps): JSX.Element {
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <GoogleMapReact
        center={{
          lat: (location || DEFAULT_LAT_LNG).lat,
          lng: (location || DEFAULT_LAT_LNG).lng,
        }}
        yesIWantToUseGoogleMapApiInternals
        defaultZoom={10}
      >
        {hospitals.map((hospital) => (
          <HospitalMarker
            key={hospital.id}
            lat={hospital.location.lat}
            lng={hospital.location.lng}
            name={hospital.name}
          />
        ))}
      </GoogleMapReact>
    </div>
  );
}
