import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, Globe, Bell, Eye, User, Phone, Mail, GraduationCap, BookOpen, Users, Copy, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { useFormContext } from '../../context/FormContext';
import { finalSchema } from '../../utils/validation';
import { submitRegistration, checkReferral } from '../../services/api';
import { cn } from '../../utils/cn';

interface FinalSubmissionProps {
  onBack: () => void;
}

const howHeardOptions = [
  { value: 'social-media', label: 'Social Media' },
  { value: 'search-engine', label: 'Search Engine' },
  { value: 'referral', label: 'Referral' },
  { value: 'word-of-mouth', label: 'Word of Mouth' },
  { value: 'ad', label: 'Ad' },
  { value: 'other', label: 'Other' },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const REFERRAL_LINK = 'https://intern00.netlify.app/register';

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-xs text-on-surface-variant">{label}</p>
        <p className="text-sm font-medium text-on-surface truncate">{value || '—'}</p>
      </div>
    </div>
  );
}

export function FinalSubmission({ onBack }: FinalSubmissionProps) {
  const { formData, updateFormData, emailVerified, referralCode, referralCount, referredBy, setReferralCount } = useFormContext();
  const [submitting, setSubmitting] = useState(false);
  const [subscribe, setSubscribe] = useState(formData.subscribe);
  const [checkingRef, setCheckingRef] = useState(true);
  const [canSubmit, setCanSubmit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    async function check() {
      if (!referralCode) {
        setCheckingRef(false);
        setCanSubmit(true);
        return;
      }
      try {
        const res = await checkReferral(referralCode);
        const data = res.data.data;
        if (!cancelled) {
          setReferralCount(data.count);
          setCanSubmit(data.canSubmit);
        }
      } catch {
        if (!cancelled) {
          setCanSubmit(true);
        }
      } finally {
        if (!cancelled) setCheckingRef(false);
      }
    }
    check();
    return () => { cancelled = true; };
  }, [referralCode, setReferralCount]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(finalSchema),
    defaultValues: {
      linkedIn: formData.linkedIn,
      github: formData.github,
      instagram: formData.instagram,
      howHeard: formData.howHeard || 'social-media',
      referralCode: formData.referralCode,
      acceptTerms: !!formData.acceptTerms,
    } as { linkedIn?: string; github?: string; instagram?: string; howHeard: string; referralCode?: string; acceptTerms: boolean },
  });

  const watchAcceptTerms = watch('acceptTerms');

  const copyLink = () => {
    const link = referralCode ? `${REFERRAL_LINK}?ref=${referralCode}` : REFERRAL_LINK;
    navigator.clipboard.writeText(link).then(() => {
      toast.success('Referral link copied!');
    }).catch(() => {
      toast.error('Failed to copy');
    });
  };

  const handleRefresh = async () => {
    if (!referralCode) return;
    setCheckingRef(true);
    try {
      const res = await checkReferral(referralCode);
      const data = res.data.data;
      setReferralCount(data.count);
      setCanSubmit(data.canSubmit);
      toast.success(`Referrals: ${data.count}/5`);
    } catch {
      toast.error('Failed to check');
    } finally {
      setCheckingRef(false);
    }
  };

  const onSubmit = async (data: unknown) => {
    const socialData = data as {
      linkedIn?: string;
      github?: string;
      instagram?: string;
      howHeard: string;
      referralCode?: string;
      acceptTerms: boolean;
    };

    setSubmitting(true);
    updateFormData({ ...socialData, subscribe } as typeof formData);

    try {
      const formPayload = new FormData();
      const merged = { ...formData, ...socialData, subscribe, mobileVerified: true, emailVerified, referredBy };

      (Object.keys(merged) as (keyof typeof merged)[]).forEach((key) => {
        const val = merged[key];
        if (typeof val === 'boolean') {
          formPayload.append(key, String(val));
        } else if (val) {
          formPayload.append(key, String(val));
        }
      });

      await submitRegistration(formPayload);
      toast.success('Registration submitted successfully!');
      navigate('/success');
    } catch (err: unknown) {
      const msg = (err && typeof err === 'object' && 'response' in err)
        ? (err as { response: { data: { message: string } } }).response?.data?.message || 'Registration failed'
        : 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const needsReferral = !!(referralCode && !canSubmit);
  const refCount = Math.min(referralCount, 5);
  const progressPct = (refCount / 5) * 100;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {referralCode && (
            <motion.div variants={sectionVariants} initial="hidden" animate="visible">
              <Card className="p-6 md:p-8 border-2 border-primary/20">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-on-surface">Referral Required</h2>
                    <p className="text-sm text-on-surface-variant">Invite 5 friends to unlock submission</p>
                  </div>
                </div>

                <div className="bg-info/10 border border-info/20 rounded-xl p-4 mb-5">
                  <p className="text-sm font-medium text-on-surface mb-1">How it works</p>
                  <ol className="text-xs text-on-surface-variant space-y-1.5 list-decimal list-inside">
                    <li><strong>Share your referral link</strong> with 5 friends &mdash; each friend must click the link and complete their own registration</li>
                    <li><strong>Wait for all 5 friends</strong> to register using your link (progress bar below shows count)</li>
                    <li><strong>Once 5/5 is reached</strong>, click "Submit" to complete your application</li>
                    <li><strong>Important:</strong> Your submission is locked until all 5 friends register. Referrals are mandatory.</li>
                  </ol>
                </div>

                <div className="bg-surface rounded-xl p-4 mb-4">
                  <p className="text-xs text-on-surface-variant mb-1.5">Your Referral Link</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-xs bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 truncate">
                      {referralCode ? `${REFERRAL_LINK}?ref=${referralCode}` : ''}
                    </code>
                    <button
                      type="button"
                      onClick={copyLink}
                      className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-on-surface">Progress</span>
                    <span className="text-sm font-semibold text-primary">{referralCount}/5 friends</span>
                  </div>
                  <div className="w-full h-2.5 bg-surface-dim rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {needsReferral ? (
                  <div className="flex items-start gap-2.5 bg-warning/10 rounded-xl p-3">
                    <XCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-warning">Submission Locked</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Share your referral link with 5 friends. Once they register, you can submit your application.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5 bg-success/10 rounded-xl p-3">
                    <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-success">Requirements Met!</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">You can now submit your application.</p>
                    </div>
                  </div>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  loading={checkingRef}
                  icon={<RefreshCw className="w-4 h-4" />}
                  className="mt-3"
                >
                  Check Status
                </Button>
              </Card>
            </motion.div>
          )}

          <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
            <Card className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-on-surface">Social & Referral</h2>
                  <p className="text-sm text-on-surface-variant">Connect your profiles</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="LinkedIn URL" type="url" placeholder="https://linkedin.com/in/..." error={errors.linkedIn?.message} {...register('linkedIn')} />
                <Input label="GitHub URL" type="url" placeholder="https://github.com/..." error={errors.github?.message} {...register('github')} />
                <Input label="Instagram (optional)" placeholder="@yourhandle" {...register('instagram')} />
                <Select label="How did you hear about us?" required error={errors.howHeard?.message} options={howHeardOptions} placeholder="Select an option" {...register('howHeard')} />
              </div>
            </Card>
          </motion.div>

          <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
            <Card className="p-6 md:p-8">
              <h2 className="text-lg font-semibold text-on-surface mb-6">Agreements</h2>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="sr-only"
                  {...register('acceptTerms')}
                />
                <div className={cn(
                  'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200',
                  errors.acceptTerms ? 'border-error' : 'border-outline group-hover:border-primary',
                  watchAcceptTerms && 'bg-primary/10 border-primary'
                )}>
                  {watchAcceptTerms && (
                    <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm text-on-surface">
                    I confirm that all the information provided is accurate and I agree to the{' '}
                    <span className="text-primary font-medium cursor-pointer hover:underline">Terms & Conditions</span>
                    {' '}and{' '}
                    <span className="text-primary font-medium cursor-pointer hover:underline">Privacy Policy</span>.
                    <span className="text-error ml-0.5">*</span>
                  </p>
                  {errors.acceptTerms && <p className="text-xs text-error mt-1">{errors.acceptTerms.message}</p>}
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group mt-5">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={subscribe}
                  onChange={(e) => setSubscribe(e.target.checked)}
                />
                <div className={cn(
                  'w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200',
                  subscribe ? 'bg-primary/10 border-primary' : 'border-outline group-hover:border-primary'
                )}>
                  {subscribe && (
                    <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-outline" />
                  <p className="text-sm text-on-surface">Send me updates about courses and events</p>
                </div>
              </label>
            </Card>
          </motion.div>

          <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="flex justify-between">
            <Button type="button" variant="secondary" size="lg" onClick={onBack} icon={<ChevronLeft className="w-4 h-4" />}>
              Back
            </Button>
            <Button
              type="submit"
              size="lg"
              loading={submitting}
              disabled={needsReferral}
              icon={<Send className="w-4 h-4" />}
            >
              {needsReferral ? `Refer ${5 - referralCount} More Friends` : 'Submit'}
            </Button>
          </motion.div>
        </div>

        <div className="lg:col-span-2">
          <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.15 }}>
            <div className="sticky top-8">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-base font-semibold text-on-surface">Summary</h2>
                </div>

                <div className="space-y-1 divide-y divide-outline-variant/50">
                  <div>
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Personal</p>
                    <InfoRow icon={User} label="Name" value={formData.fullName} />
                    <InfoRow icon={Phone} label="Mobile" value={formData.mobileNumber} />
                    <InfoRow icon={Mail} label="Email" value={formData.email} />
                  </div>

                  <div className="pt-3 mt-3">
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" /> Education
                    </p>
                    <InfoRow icon={BookOpen} label="College" value={formData.collegeName} />
                    <InfoRow icon={BookOpen} label="Course" value={formData.courseName} />
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </form>
  );
}
