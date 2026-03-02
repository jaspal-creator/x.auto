import * as React from 'react';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';

export default function Steps(): React.ReactNode {
  const [step, setStep] = React.useState<number>(0);

  return (
    <>
      {step === 0 && <StepOne nextStep={setStep} />}
      {step === 1 && <StepTwo nextStep={setStep} />}
      {step === 2 && <StepThree nextStep={setStep} />}
      {step === 3 && <StepFour />}
    </>
  );
}
