import { ShorthandPropertyAssignment } from "typescript";

export type GasFreeTransactionAllowanceRequestStatus = 'permitted' | 'outstanding' | 'refused';

export interface GasFreeTransactionAllowanceRequest {
  id: string;
  status: GasFreeTransactionAllowanceRequestStatus;
  user: string;
  username: string; 
  requestDate: number;
  remainingGasFreeTransactions: string; 
}
