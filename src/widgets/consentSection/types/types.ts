export interface ConsentSectionProps {
  hasConsent: boolean;
  onShowConsentModal: () => void;
  userRole: 'patient' | 'doctor' | 'clinic';
}