import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { StudentFormData, FormStep } from '../types';
import { saveProgress } from '../services/api';

export const formSteps: FormStep[] = [
  { id: 1, title: 'Personal Details', subtitle: 'Basic information', icon: 'user' },
  { id: 2, title: 'Education Details', subtitle: 'Academic background', icon: 'book' },
  { id: 3, title: 'Final Review', subtitle: 'Review & submit', icon: 'check' },
];

const defaultFormData: StudentFormData = {
  fullName: '',
  mobileNumber: '',
  whatsappNumber: '',
  email: '',
  gender: '',
  dateOfBirth: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  collegeName: '',
  courseName: '',
  branch: '',
  currentYear: '',
  graduationYear: '',
  linkedIn: '',
  github: '',
  instagram: '',
  howHeard: '',
  referralCode: '',
  acceptTerms: false,
  subscribe: true,
};

interface FormContextType {
  currentStep: number;
  formData: StudentFormData;
  emailVerified: boolean;
  referralCode: string;
  referralCount: number;
  referredBy: string;
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<StudentFormData>) => void;
  setEmailVerified: (verified: boolean) => void;
  setReferralCode: (code: string) => void;
  setReferralCount: (count: number) => void;
  setReferredBy: (code: string) => void;
  resetForm: () => void;
  restoreProgress: (data: {
    formData: StudentFormData;
    emailVerified: boolean;
    referralCode: string;
    referredBy: string;
    currentStep: number;
  }) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<StudentFormData>(defaultFormData);
  const [emailVerified, setEmailVerified] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [referredBy, setReferredBy] = useState('');

  const triggerSave = useCallback(() => {
    const email = formData.email;
    if (!email || !emailVerified) return;
    const data = {
      formData,
      emailVerified,
      referralCode,
      referredBy,
      currentStep,
    };
    saveProgress(email, data).catch(() => {});
  }, [formData, emailVerified, referralCode, referredBy, currentStep]);

  useEffect(() => {
    if (!emailVerified || !formData.email) return;
    const timer = setTimeout(triggerSave, 2000);
    return () => clearTimeout(timer);
  }, [formData, triggerSave, emailVerified, formData.email]);

  const updateFormData = useCallback((data: Partial<StudentFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    setCurrentStep(1);
    setEmailVerified(false);
    setReferralCode('');
    setReferralCount(0);
    setReferredBy('');
  }, []);

  const restoreProgress = useCallback((data: {
    formData: StudentFormData;
    emailVerified: boolean;
    referralCode: string;
    referredBy: string;
    currentStep: number;
  }) => {
    setFormData(data.formData);
    setEmailVerified(data.emailVerified);
    setReferralCode(data.referralCode || '');
    setReferredBy(data.referredBy || '');
    setCurrentStep(data.currentStep || 1);
  }, []);

  return (
    <FormContext.Provider
      value={{
        currentStep,
        formData,
        emailVerified,
        referralCode,
        referralCount,
        referredBy,
        setCurrentStep,
        updateFormData,
        setEmailVerified,
        setReferralCode,
        setReferralCount,
        setReferredBy,
        resetForm,
        restoreProgress,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error('useFormContext must be used within FormProvider');
  return ctx;
}
