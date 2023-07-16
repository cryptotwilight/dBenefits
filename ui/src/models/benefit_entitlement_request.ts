export type BenefitEntitlementRequestStatus = 'granted' | 'pending' | 'declined';

export interface BenefitEntitlementRequest {
  id: string;
  status: BenefitEntitlementRequestStatus;
  user: string;
  username : string; 
  requestDate: number;
  benefitType: string; 
}
