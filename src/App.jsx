import React, { useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import PasscodeScreen from './components/PasscodeScreen';
import GiftUnboxing from './components/GiftUnboxing';
import MainBirthdayPage from './components/MainBirthdayPage';

export default function App() {
  const [currentStep, setCurrentStep] = useState('loading'); // 'loading' | 'passcode' | 'unboxing' | 'unlocked'

  return (
    <div className="mobile-app-shell">
      {currentStep === 'loading' && (
        <LoadingScreen onComplete={() => setCurrentStep('passcode')} />
      )}

      {currentStep === 'passcode' && (
        <PasscodeScreen onUnlock={() => setCurrentStep('unboxing')} />
      )}

      {currentStep === 'unboxing' && (
        <GiftUnboxing onOpen={() => setCurrentStep('unlocked')} />
      )}

      {currentStep === 'unlocked' && (
        <MainBirthdayPage />
      )}
    </div>
  );
}
