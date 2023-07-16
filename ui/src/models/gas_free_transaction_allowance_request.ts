export type GasFreeTransactionAllowanceRequestStatus = 'granted' | 'pending' | 'declined';

export interface GassFreeTransactionAllowanceRequest {
  id: string;
  status: GasFreeTransactionAllowanceRequestStatus;
  user: string;
  requestDate: number;
  requestID: string;
  remainingGasFreeTransactions: string; 
}
