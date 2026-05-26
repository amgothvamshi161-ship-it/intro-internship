import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, User, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { useFormContext } from '../../context/FormContext';
import { personalInfoSchema } from '../../utils/validation';

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
  const { formData, updateFormData, setEmailVerified } = useFormContext();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
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

  const onSubmit = async (data: unknown) => {
    setSubmitting(true);
    updateFormData(data as typeof formData);
    setEmailVerified(true);
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
              <h2 className="text-lg font-semibold text-on-surface">Email Address</h2>
              <p className="text-sm text-on-surface-variant">Your email for communication</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
            <Input
              label="Email Address"
              type="email"
              required
              error={errors.email?.message}
              {...register('email')}
            />
          </div>
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