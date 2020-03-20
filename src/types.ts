export type Location = {
  address: string,
  googleMapsPlaceId: string,
  lat: number,
  lng: number
}

export interface HospitalForUI extends Hospital {
  id: string,
  distanceMiles?: number
}

export const validateLocation = (place: Location): string[] => {
  const validationErrors = [];
  if (place.address.trim() === '') validationErrors.push('Location address cannot be empty.')
  if (place.googleMapsPlaceId.trim() === '') validationErrors.push('Location place id cannot be empty (must be a valid Google Maps location).')
  return validationErrors;
}

export type Hospital = {
  name: string,
  location: Location,
  totalBedCount: number,
  occupiedBedCount: number
}

export const validateHospital = (hospital: Hospital): string[] => {
  const validationErrors = [];
  if (hospital.name.trim() === '') validationErrors.push('Hospital name cannot be empty.')
  if (!hospital.location) {
    validationErrors.push('Hospital must have a location')
  } else {
    validateLocation(hospital.location).forEach(locationError => {
      validationErrors.push(locationError)
    })
  }
  if (hospital.totalBedCount < 0) validationErrors.push('Hospital bed count cannot be negative.')
  if (hospital.occupiedBedCount < 0) validationErrors.push('Occupied bed count cannot be negative.')
  if (hospital.occupiedBedCount > hospital.totalBedCount) validationErrors.push('Occupied bed cannot be greater than total bed count.')
  return validationErrors;
}
