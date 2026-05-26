import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="block text-sm font-medium text-on-surface-variant">
          {label}
          {props.required && <span className="text-error ml-0.5">*</span>}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-outline/60 transition-all duration-200 text-sm',
            'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10',
            error && 'border-error focus:border-error focus:ring-error/10',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-error flex items-center gap-1 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
