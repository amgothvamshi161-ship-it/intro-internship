import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Success() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={show ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, type: 'spring' }}
        className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 sm:p-12 text-center max-w-md w-full shadow-sm"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={show ? { scale: 1 } : {}}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-8 h-8 text-success" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-on-surface mb-2">Application Submitted!</h1>
          <p className="text-on-surface-variant mb-6 leading-relaxed">
            Thank you for applying to Intro Internship. We've received your application and our team will review it shortly.
            You'll receive a confirmation email with next steps.
          </p>
          <div className="bg-primary-container/30 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm font-medium text-primary mb-1">What happens next?</p>
            <ul className="text-xs text-on-surface-variant space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-success mt-0.5">✓</span>
                Application review (1-2 business days)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success mt-0.5">✓</span>
                Interview/skill assessment call
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success mt-0.5">✓</span>
                Onboarding & program start
              </li>
            </ul>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all active:scale-95"
          >
            Back to Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
