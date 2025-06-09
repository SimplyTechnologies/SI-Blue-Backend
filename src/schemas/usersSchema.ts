import { z } from 'zod';


export const UserRole = z.enum(['user', 'superadmin']);
export type UserRoleType = z.infer<typeof UserRole>;


export const UserSchema = z.object({
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
      .min(5, 'Phone number must be at least 10 digits')
      .max(25, 'Phone number must be less than 25 digits')
      .regex(/^\+?[\d\s()-]+$/, 'Invalid phone number format')
      .transform(str => str.replace(/\s/g, '')),
  
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be less than 128 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
    role: UserRole.default('user'),
    isActive: z.boolean().default(true)
  });
  


export const RegisterSchema = UserSchema.extend({
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});


export const LoginSchema = z.object({

  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1)
});



export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
  confirmPassword: z.string().min(1)
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const AccountActivationSchema = z
  .object({
    token: z.string(),
    password: z.string().min(8).max(128),
    confirmPassword: z.string().min(1),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type UserInput = z.infer<typeof UserSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type AccountActivationSchemaInput = z.infer<typeof AccountActivationSchema>;















