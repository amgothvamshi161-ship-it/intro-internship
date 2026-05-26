import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { BookOpen, ChevronLeft, ChevronRight, GraduationCap, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { useFormContext } from '../../context/FormContext';
import { educationSchema } from '../../utils/validation';

interface EducationDetailsProps {
  onNext: () => void;
  onBack: () => void;
}

const courseOptions = [
  { value: 'btech', label: 'B.Tech / B.E.' },
  { value: 'bsc-cs', label: 'B.Sc. CS' },
  { value: 'ba-gd', label: 'B.A. Graphic Design' },
  { value: 'msc', label: 'M.Sc.' },
  { value: 'mba', label: 'MBA' },
  { value: 'other', label: 'Other' },
];

const yearOptions = [
  { value: '1st', label: '1st Year' },
  { value: '2nd', label: '2nd Year' },
  { value: '3rd', label: '3rd Year' },
  { value: 'final', label: 'Final Year' },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function EducationDetails({ onNext, onBack }: EducationDetailsProps) {
  const { formData, updateFormData } = useFormContext();
  const [studentId, setStudentId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      collegeName: formData.collegeName,
      courseName: formData.courseName,
      branch: formData.branch,
      currentYear: formData.currentYear,
      graduationYear: formData.graduationYear,
    },
  });

  const onSubmit = async (data: unknown) => {
    setSubmitting(true);
    updateFormData({ ...(data as typeof formData), studentId } as typeof formData);
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
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-on-surface">Education Details</h2>
              <p className="text-sm text-on-surface-variant">Your academic background</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Input label="College / University Name" required error={errors.collegeName?.message} {...register('collegeName')} />
            </div>
            <Select label="Course Name" required error={errors.courseName?.message} options={courseOptions} placeholder="Select your course" {...register('courseName')} />
            <Input label="Branch / Specialization" required error={errors.branch?.message} {...register('branch')} />
            <Select label="Current Year" required error={errors.currentYear?.message} options={yearOptions} placeholder="Select current year" {...register('currentYear')} />
            <Input label="Graduation Year" type="text" required maxLength={4} placeholder="e.g. 2026" error={errors.graduationYear?.message} {...register('graduationYear')} />
          </div>
        </Card>
      </motion.div>

      <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
        <Card className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-on-surface">Student ID (Optional)</h2>
              <p className="text-sm text-on-surface-variant">Upload your student ID card later in the final step</p>
            </div>
          </div>

          <Input label="Student ID Number" placeholder="Enter your student ID if available" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
        </Card>
      </motion.div>

      <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.15 }}>
        <div className="border-l-4 border-secondary bg-secondary/5 rounded-r-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-on-surface">Important Note</p>
            <p className="text-sm text-on-surface-variant mt-0.5">
              Please ensure all details match your official academic documents. Any discrepancy may lead to rejection of your application.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="flex justify-between">
        <Button type="button" variant="secondary" size="lg" onClick={onBack} icon={<ChevronLeft className="w-4 h-4" />}>
          Back
        </Button>
        <Button type="submit" size="lg" loading={submitting} icon={<ChevronRight className="w-4 h-4" />}>
          Next Step
        </Button>
      </motion.div>
    </form>
  );
}
