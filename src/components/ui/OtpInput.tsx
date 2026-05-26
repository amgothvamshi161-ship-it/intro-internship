import { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  error?: string;
}

export function OtpInput({ length = 6, onComplete, error }: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (otp.every((d) => d !== '')) {
      onComplete(otp.join(''));
    }
  }, [otp, onComplete]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 justify-center">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputsRef.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={cn(
              'w-10 h-12 text-center text-lg font-semibold rounded-lg border transition-all duration-200',
              'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10',
              error ? 'border-error' : 'border-outline-variant'
            )}
          />
        ))}
      </div>
      {error && <p className="text-xs text-error text-center">{error}</p>}
    </div>
  );
}
