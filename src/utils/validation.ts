import { z } from 'zod/v4';

export const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  mobileNumber: z.string().regex(/^[0-9]{10}$/, 'Enter a valid 10-digit mobile number'),
  whatsappNumber: z.string().regex(/^[0-9]{10}$/, 'Enter a valid 10-digit number').optional().or(z.literal('')),
  email: z.string().email('Enter a valid email address'),
  gender: z.string().min(1, 'Select your gender'),
  dateOfBirth: z.string().min(1, 'Enter your date of birth'),
  address: z.string().min(5, 'Enter your full address'),
  city: z.string().min(2, 'Enter your city'),
  state: z.string().min(2, 'Enter your state'),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Enter a valid 6-digit pincode'),
});

export const educationSchema = z.object({
  collegeName: z.string().min(2, 'Enter your college/university name'),
  courseName: z.string().min(1, 'Select your course'),
  branch: z.string().min(2, 'Enter your branch/specialization'),
  currentYear: z.string().min(1, 'Select your current year'),
  graduationYear: z.string().regex(/^[0-9]{4}$/, 'Enter a valid year'),
});

export const finalSchema = z.object({
  linkedIn: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  github: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  instagram: z.string().optional().or(z.literal('')),
  howHeard: z.string().min(1, 'Select how you heard about us'),
  referralCode: z.string().optional().or(z.literal('')),
  acceptTerms: z.boolean().refine((val) => val === true, { message: 'You must accept the terms' }),
});
