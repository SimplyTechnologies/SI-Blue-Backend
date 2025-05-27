import { z } from 'zod';

export const CustomerSchema = z.object({
    firstName: z
      .string({ required_error: 'First name is required' })
      .min(2, 'First name cannot be empty')
      .max(50, 'First name must be less than 50 characters')
      .transform(str => str.trim()),
  
    lastName: z
      .string({ required_error: 'Last name is required' })
      .min(2, 'Last name cannot be empty')
      .max(50, 'Last name must be less than 50 characters')
      .transform(str => str.trim()),
  
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format')
      .max(100, 'Email must be less than 100 characters')
      .toLowerCase()
      .transform(str => str.trim()),
  
    phoneNumber: z
      .string({ required_error: 'Phone number is required' })
      .min(10, 'Phone number must be at least 10 digits')
      .max(25, 'Phone number must be less than 25 digits')
      .regex(/^\+?[\d\s()-]+$/, 'Invalid phone number format')
      .transform(str => str.replace(/\s/g, '')),
    
  vehicleId: z
       .number({required_error: "vehicle ID is required"})
  });
  




export type CustomerSchema = z.infer<typeof CustomerSchema>;
















