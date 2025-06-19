import { z } from 'zod';
export const LocationSchema = z.object({
  country: z
    .string({ required_error: 'Country is required' })
    .min(3, 'Country cannot be empty')
    .transform(str => str.trim()),
  state: z
    .string({ required_error: 'State is required' })
    .min(3, 'State cannot be empty')
    .transform(str => str.trim()),
  city: z
    .string({ required_error: 'City is required' })
    .min(2, 'City cannot be empty')
    .transform(str => str.trim()),
  zipcode: z
    .string({ required_error: 'Zipcode is required' })
    .min(3, 'Zipcode cannot be empty')
    .transform(str => str.trim()),
  street: z
    .string({ required_error: 'Street is required' })
    .min(2, 'Street cannot be empty')
    .transform(str => str.trim()),
  lat: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .optional(),
  lng: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .optional(),
});

const validateVIN = (vin: string): boolean => {
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  return vinRegex.test(vin);
};

export const VehicleSchema = z.object({
  vin: z
    .string({ required_error: 'VIN is required' })
    .transform(str => str.trim().toUpperCase())
    .refine(validateVIN, {
      message: 'VIN must be 17 characters long and contain only valid characters (no I, O, Q)',
    }),
  year: z
    .number({ required_error: 'Year is required' })
    .int('Year must be an integer')
    .min(1900, 'Year must be 1900 or later')
    .max(new Date().getFullYear() + 1, 'Year cannot be more than 1 year in the future'),
  location: LocationSchema,
  modelId: z
    .number({ required_error: 'Model ID is required' })
    .int('Model ID must be an integer')
    .positive('Model ID must be positive'),
  userId: z.number().int('User ID must be an integer').positive('User ID must be positive').optional(),
});

export type CreateVehicle = z.infer<typeof VehicleSchema>;

export type LocationData = z.infer<typeof LocationSchema>;
