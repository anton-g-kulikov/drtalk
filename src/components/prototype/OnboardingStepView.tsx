"use client";

import React from 'react';
import type { UserRole } from '@/components/VerificationContext';
import {
  OnboardingAuthStep,
  OnboardingJoinPracticeStep,
  OnboardingPracticeDetailsStep,
  OnboardingPracticeInviteStep,
} from '@/components/prototype/onboarding/OnboardingRemainingSteps';
import {
  OnboardingRoleSelectionStep,
  OnboardingSuccessStep,
  OnboardingUserRoleStep,
  OnboardingVerifyStep,
} from '@/components/prototype/onboarding/OnboardingSimpleSteps';

export type OnboardingStep =
  | 'AUTH'
  | 'VERIFY'
  | 'USER_ROLE'
  | 'ROLE_SELECTION'
  | 'PRACTICE_DETAILS'
  | 'JOIN_PRACTICE'
  | 'PRACTICE_INVITE'
  | 'SUCCESS';

type InviteDraft = { email: string; role: string };

type OnboardingStepViewProps = {
  step: OnboardingStep;
  isIndividualFlow: boolean;
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  userRole: UserRole;
  setUserRole: React.Dispatch<React.SetStateAction<UserRole>>;
  practiceType: string;
  setPracticeType: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  firstName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  lastName: string;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  practiceName: string;
  setPracticeName: React.Dispatch<React.SetStateAction<string>>;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;
  zipCode: string;
  setZipCode: React.Dispatch<React.SetStateAction<string>>;
  fullAddress: string;
  setFullAddress: React.Dispatch<React.SetStateAction<string>>;
  selectedState: string;
  setSelectedState: React.Dispatch<React.SetStateAction<string>>;
  wantsFax: boolean;
  setWantsFax: React.Dispatch<React.SetStateAction<boolean>>;
  faxNumber: string;
  setFaxNumber: React.Dispatch<React.SetStateAction<string>>;
  isPracticeDetailsLoading: boolean;
  showNpiTooltip: boolean;
  handlePracticeNameClick: () => void;
  invites: InviteDraft[];
  setInvites: React.Dispatch<React.SetStateAction<InviteDraft[]>>;
  addInvite: () => void;
  updateInvite: (index: number, field: 'email' | 'role', value: string) => void;
  practiceTypes: string[];
  dentistTypes: string[];
  nextStep: (next: OnboardingStep) => void;
  verify: (role: UserRole) => void;
  router: { push: (href: string) => void };
};

export function OnboardingStepView(props: OnboardingStepViewProps) {
  switch (props.step) {
    case 'AUTH':
      return (
        <OnboardingAuthStep
          isIndividualFlow={props.isIndividualFlow}
          isLogin={props.isLogin}
          setIsLogin={props.setIsLogin}
          email={props.email}
          setEmail={props.setEmail}
          firstName={props.firstName}
          setFirstName={props.setFirstName}
          lastName={props.lastName}
          setLastName={props.setLastName}
          nextStep={props.nextStep}
          verify={props.verify}
          router={props.router}
        />
      );
    case 'VERIFY':
      return (
        <OnboardingVerifyStep
          isIndividualFlow={props.isIndividualFlow}
          setUserRole={props.setUserRole}
          nextStep={props.nextStep}
        />
      );
    case 'USER_ROLE':
      return (
        <OnboardingUserRoleStep
          userRole={props.userRole}
          setUserRole={props.setUserRole}
          invites={props.invites}
          setInvites={props.setInvites}
          nextStep={props.nextStep}
        />
      );
    case 'ROLE_SELECTION':
      return <OnboardingRoleSelectionStep nextStep={props.nextStep} />;
    case 'PRACTICE_DETAILS':
      return (
        <OnboardingPracticeDetailsStep
          practiceType={props.practiceType}
          setPracticeType={props.setPracticeType}
          practiceName={props.practiceName}
          setPracticeName={props.setPracticeName}
          phone={props.phone}
          setPhone={props.setPhone}
          city={props.city}
          setCity={props.setCity}
          zipCode={props.zipCode}
          setZipCode={props.setZipCode}
          fullAddress={props.fullAddress}
          setFullAddress={props.setFullAddress}
          selectedState={props.selectedState}
          setSelectedState={props.setSelectedState}
          wantsFax={props.wantsFax}
          setWantsFax={props.setWantsFax}
          faxNumber={props.faxNumber}
          setFaxNumber={props.setFaxNumber}
          isPracticeDetailsLoading={props.isPracticeDetailsLoading}
          showNpiTooltip={props.showNpiTooltip}
          handlePracticeNameClick={props.handlePracticeNameClick}
          practiceTypes={props.practiceTypes}
          nextStep={props.nextStep}
        />
      );
    case 'JOIN_PRACTICE':
      return <OnboardingJoinPracticeStep nextStep={props.nextStep} />;
    case 'PRACTICE_INVITE':
      return (
        <OnboardingPracticeInviteStep
          invites={props.invites}
          addInvite={props.addInvite}
          updateInvite={props.updateInvite}
          nextStep={props.nextStep}
        />
      );
    case 'SUCCESS':
      return (
        <OnboardingSuccessStep
          userRole={props.userRole}
          practiceType={props.practiceType}
          dentistTypes={props.dentistTypes}
          verify={props.verify}
          router={props.router}
        />
      );
  }
}
