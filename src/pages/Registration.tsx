import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FormProvider, useFormContext, formSteps } from '../context/FormContext';
import { FormLayout } from '../components/layout/FormLayout';
import { PersonalInfo } from '../components/forms/PersonalInfo';
import { EducationDetails } from '../components/forms/EducationDetails';
import { FinalSubmission } from '../components/forms/FinalSubmission';

function RegistrationForm() {
  const { currentStep, setCurrentStep, setReferredBy, updateFormData } = useFormContext();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setReferredBy(ref);
      updateFormData({ referralCode: ref });
    }
  }, [searchParams, setReferredBy, updateFormData]);

  const handleNext = () => {
    if (currentStep < formSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <FormLayout currentStep={currentStep}>
      {currentStep === 1 && <PersonalInfo onNext={handleNext} />}
      {currentStep === 2 && <EducationDetails onNext={handleNext} onBack={handleBack} />}
      {currentStep === 3 && <FinalSubmission onBack={handleBack} />}
    </FormLayout>
  );
}

export default function Registration() {
  return (
    <FormProvider>
      <RegistrationForm />
    </FormProvider>
  );
}
