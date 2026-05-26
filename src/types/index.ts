export interface StudentFormData {
  fullName: string;
  mobileNumber: string;
  whatsappNumber: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  collegeName: string;
  courseName: string;
  branch: string;
  currentYear: string;
  graduationYear: string;
  linkedIn: string;
  github: string;
  instagram: string;
  howHeard: string;
  referralCode: string;
  acceptTerms: boolean;
  subscribe: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface StudentDocument {
  _id: string;
  fullName: string;
  mobileNumber: string;
  whatsappNumber?: string;
  email: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  collegeName?: string;
  courseName?: string;
  branch?: string;
  currentYear?: string;
  graduationYear?: string;
  linkedIn?: string;
  github?: string;
  instagram?: string;
  howHeard?: string;
  referralCode?: string;
  referredBy?: string;
  emailVerified: boolean;
  subscribe?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalRegistrations: number;
  verifiedUsers: number;
  pendingVerifications: number;
  recentRegistrations: StudentDocument[];
}

export type FormStep = {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
};
