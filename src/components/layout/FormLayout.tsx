import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { StepIndicator } from '../ui/StepIndicator';
import { ProgressBar } from '../ui/ProgressBar';
import { formSteps } from '../../context/FormContext';

interface FormLayoutProps {
  children: ReactNode;
  currentStep: number;
}

export function FormLayout({ children, currentStep }: FormLayoutProps) {
  const progress = ((currentStep - 1) / formSteps.length) * 100;

  return (
    <div className="min-h-screen bg-surface py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ProgressBar progress={progress} className="mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          <div className="hidden md:block md:col-span-3 lg:col-span-3">
            <div className="sticky top-24 bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-on-surface mb-4">Enrollment Journey</h3>
              <StepIndicator steps={formSteps} currentStep={currentStep} />
            </div>
          </div>

          <div className="md:col-span-9 lg:col-span-9">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
