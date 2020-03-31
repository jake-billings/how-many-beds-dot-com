export type Location = {
  address: string;
  googleMapsPlaceId: string;
  lat: number;
  lng: number;
};

export interface HospitalForUI extends Hospital {
  id: string;
  distanceMiles?: number;
}

export const validateLocation = (place: Location): string[] => {
  const validationErrors = [];
  if (place.address.trim() === '') validationErrors.push('Location address cannot be empty.');
  if (place.googleMapsPlaceId.trim() === '')
    validationErrors.push('Location place id cannot be empty (must be a valid Google Maps location).');
  return validationErrors;
};

const phoneRegex = /^[0-9\(\) -]*$/;

const validatePhone = (phone: string): string[] => {
  const validationErrors = [];

  if (!phone.match(phoneRegex)) validationErrors.push('Hospital phone must be a valid phone number.');

  return validationErrors;
};

export type Hospital = {
  name: string;
  location: Location;
  phone: string;
  capacityPercent: number;
  isCovidCenter: boolean;
  sharingCovidPatientCount: boolean;
  covidPatientCount: number;
  covidCapableBedCount: number;
  icuCovidCapableBedCount: number;
  ventilatorCount: number;
};

export const validateHospital = (hospital: Hospital): string[] => {
  const validationErrors = [];
  if (hospital.name.trim() === '') validationErrors.push('Hospital name cannot be empty.');
  if (!hospital.phone) {
    validationErrors.push('Hospital phone cannot be empty.');
  } else {
    validatePhone(hospital.phone).forEach((phoneError) => {
      validationErrors.push(phoneError);
    });
  }
  if (!hospital.location) {
    validationErrors.push('Hospital must have a location');
  } else {
    validateLocation(hospital.location).forEach((locationError) => {
      validationErrors.push(locationError);
    });
  }
  if (hospital.sharingCovidPatientCount && hospital.covidPatientCount < 0)
    validationErrors.push('COVID patient count cannot be negative.');
  if (hospital.covidCapableBedCount < 0) validationErrors.push('COVID capabale bed count cannot be negative.');
  if (hospital.icuCovidCapableBedCount < 0) validationErrors.push('ICU+COVID capable bed cannot be negative.');
  if (hospital.ventilatorCount < 0) validationErrors.push('Ventilator count cannot be negative.');
  return validationErrors;
};

export type User = {
  lastSignedIn: Date;
  editorOf: string;
  isAdmin: boolean;
  email: string;
};

export interface UserForUI extends User {
  id: string;
}
