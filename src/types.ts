export type Hospital = {
  name: String,
  address: String,
  totalBedCount: number,
  occupiedBedCount: number
}

export const validateHospital = (hospital: Hospital): string[] => {
  const validationErrors = [];
  if (hospital.name.trim() === '') validationErrors.push('Hospital name cannot be empty.')
  if (hospital.address.trim() === '') validationErrors.push('Hospital address cannot be empty.')
  if (hospital.totalBedCount < 0) validationErrors.push('Hospital bed count cannot be negative.')
  if (hospital.occupiedBedCount < 0) validationErrors.push('Occupied bed count cannot be negative.')
  if (hospital.occupiedBedCount > hospital.totalBedCount) validationErrors.push('Occupied bed cannot be greater than total bed count.')
  return validationErrors;
}
