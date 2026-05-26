import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, User, ChevronRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { OtpInput } from '../ui/OtpInput';
import { Card } from '../ui/Card';
import { useFormContext } from '../../context/FormContext';
import { personalInfoSchema } from '../../utils/validation';
import { sendEmailOtp, verifyEmailOtp, loadProgress } from '../../services/api';
interface PersonalInfoProps {
  onNext: () => void;
}

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function PersonalInfo({ onNext }: PersonalInfoProps) {
  const { formData, updateFormData, emailVerified, setEmailVerified, setReferralCode, restoreProgress } = useFormContext();
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpValue, setEmailOtpValue] = useState('');
  const [emailOtpError, setEmailOtpError] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [emailResendTimer, setEmailResendTimer] = useState(0);

  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: formData.fullName,
      mobileNumber: formData.mobileNumber,
      whatsappNumber: formData.whatsappNumber,
      email: formData.email,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
    },
  });

  const watchEmail = watch('email');

  useEffect(() => {
    if (formData.email && !emailVerified) {
      setValue('email', formData.email);
    }
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (emailResendTimer > 0) {
      interval = setInterval(() => setEmailResendTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [emailResendTimer]);

  const handleSendEmailOtp = useCallback(async () => {
    const email = watchEmail;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Enter a valid email address first');
      return;
    }
    setEmailSending(true);
    try {
      await sendEmailOtp(email);
      setEmailOtpSent(true);
      setEmailResendTimer(60);
      toast.success('OTP sent to your email');
    } catch {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setEmailSending(false);
    }
  }, [watchEmail]);

  const handleVerifyEmailOtp = useCallback(async () => {
    if (emailOtpValue.length !== 6) {
      setEmailOtpError('Enter the complete 6-digit OTP');
      return;
    }
    setEmailVerifying(true);
    setEmailOtpError('');
    try {
      const res = await verifyEmailOtp(watchEmail, emailOtpValue);
      const code = res?.data?.data?.referralCode;
      if (code) setReferralCode(code);
      setEmailVerified(true);
      toast.success('Email verified');

      const emailAddr = watchEmail;
      if (emailAddr) {
        const savedRes = await loadProgress(emailAddr);
        const savedData = savedRes?.data?.data;
        if (savedData) {
          restoreProgress(savedData);
          setValue('fullName', savedData.formData.fullName || '');
          setValue('mobileNumber', savedData.formData.mobileNumber || '');
          setValue('whatsappNumber', savedData.formData.whatsappNumber || '');
          setValue('email', savedData.formData.email || '');
          setValue('gender', savedData.formData.gender || '');
          setValue('dateOfBirth', savedData.formData.dateOfBirth || '');
          setValue('address', savedData.formData.address || '');
          setValue('city', savedData.formData.city || '');
          setValue('state', savedData.formData.state || '');
          setValue('pincode', savedData.formData.pincode || '');
          if (savedData.referralCode) setReferralCode(savedData.referralCode);
          toast.success('Your saved progress has been restored');
        }
      }
    } catch {
      setEmailOtpError('Invalid OTP. Please try again.');
    } finally {
      setEmailVerifying(false);
    }
  }, [emailOtpValue, watchEmail, setEmailVerified, setReferralCode, restoreProgress, setValue, watch]);

  const onSubmit = async (data: unknown) => {
    if (!emailVerified) {
      toast.error('Please verify your email address');
      return;
    }
    setSubmitting(true);
    updateFormData(data as typeof formData);
    await new Promise((r) => setTimeout(r, 300));
    setSubmitting(false);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <Card className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-on-surface">Personal Information</h2>
              <p className="text-sm text-on-surface-variant">Your basic contact details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Full Name" required error={errors.fullName?.message} {...register('fullName')} />
            <Input label="Date of Birth" type="date" required error={errors.dateOfBirth?.message} {...register('dateOfBirth')} />
            <Select label="Gender" required error={errors.gender?.message} options={genderOptions} placeholder="Select gender" {...register('gender')} />
            <Input label="WhatsApp Number" error={errors.whatsappNumber?.message} {...register('whatsappNumber')} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <Input label="Mobile Number" type="tel" maxLength={10} error={errors.mobileNumber?.message} {...register('mobileNumber')} />
            <Input label="Address" error={errors.address?.message} {...register('address')} />
            <Input label="City" required error={errors.city?.message} {...register('city')} />
            <Input label="State" required error={errors.state?.message} {...register('state')} />
            <Input label="Pincode" required error={errors.pincode?.message} {...register('pincode')} />
          </div>
        </Card>
      </motion.div>

      <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
        <Card className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-on-surface">Email Verification</h2>
              <p className="text-sm text-on-surface-variant">Verify your email with OTP</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
            <Input
              label="Email Address"
              type="email"
              required
              error={errors.email?.message}
              {...register('email')}
            />
            <div className="flex items-end gap-3">
              {!emailVerified ? (
                <Button
                  type="button"
                  variant={emailOtpSent ? 'secondary' : 'primary'}
                  onClick={handleSendEmailOtp}
                  loading={emailSending}
                  disabled={emailVerified}
                  icon={<Mail className="w-4 h-4" />}
                  className="w-full"
                >
                  {emailVerified ? 'Verified' : emailOtpSent ? emailResendTimer > 0 ? `Resend (${emailResendTimer}s)` : 'Resend OTP' : 'Send OTP'}
                </Button>
              ) : (
                <div className="flex items-center gap-2 text-success text-sm font-medium w-full px-4 py-2.5 bg-success/10 rounded-xl">
                  <ShieldCheck className="w-4 h-4" />
                  Verified
                </div>
              )}
            </div>
          </div>

          {emailOtpSent && !emailVerified && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 space-y-4">
              <OtpInput length={6} onComplete={setEmailOtpValue} error={emailOtpError} />
              <Button type="button" variant="primary" onClick={handleVerifyEmailOtp} loading={emailVerifying} className="w-full">
                Verify OTP
              </Button>
            </motion.div>
          )}
        </Card>
      </motion.div>

      <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="flex justify-end">
        <Button type="submit" size="lg" loading={submitting} icon={<ChevronRight className="w-4 h-4" />}>
          Next Step
        </Button>
      </motion.div>
    </form>
  );
}
