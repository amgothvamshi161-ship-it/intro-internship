import { cn } from '../../utils/cn';
import type { FormStep } from '../../types';

interface StepIndicatorProps {
  steps: FormStep[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="hidden md:flex flex-col gap-3">
      {steps.map((step) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        return (
          <div key={step.id} className="flex items-center gap-3">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shrink-0',
                isActive && 'bg-primary text-white shadow-md shadow-primary/20',
                isCompleted && 'bg-success text-white',
                !isActive && !isCompleted && 'bg-surface-dim text-outline'
              )}
            >
              {isCompleted ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.id
              )}
            </div>
            <div className={cn('transition-all', isActive ? 'opacity-100' : 'opacity-60')}>
              <p className={cn('text-sm font-medium', isActive && 'text-primary')}>{step.title}</p>
              <p className="text-xs text-on-surface-variant">{step.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
