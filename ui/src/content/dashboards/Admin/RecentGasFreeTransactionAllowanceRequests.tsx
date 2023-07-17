import { Card } from '@mui/material';
import { GasFreeTransactionAllowanceRequest } from 'src/models/gas_free_transaction_allowance_request';
import RecentGasFreeTransactionAllowanceRequestsTable from './RecentGasFreeTransactionAllowanceRequestsTable';

function RecentGasFreeTransactionAllowanceRequests() {
  const gasFreeTransactionAllowanceRequests: GasFreeTransactionAllowanceRequest[] = [
    { 
      id: "1",
      status: "outstanding",
      user: "0xa795376918902EAd9fb069fEe1B1D328A5545B85",
      username: "Tenor",
      requestDate: new Date().getTime(),
      remainingGasFreeTransactions: '1' 
    },
    { 
      id: "2",
      status: "outstanding",
      user: "0xa795376918902EAd9fb069fEe1B1D328A5545B85",
      username: "Michael",
      requestDate: new Date().getTime(),
      remainingGasFreeTransactions: '0' 
    },
    { 
      id: "3",
      status: "refused",
      user: "0xa795376918902EAd9fb069fEe1B1D328A5545B85",
      username: "Gladys",
      requestDate: new Date().getTime(),
      remainingGasFreeTransactions: '3' 
    },
    { 
      id: "4",
      status: "permitted",
      user: "0xa795376918902EAd9fb069fEe1B1D328A5545B85",
      username: "Ken",
      requestDate: new Date().getTime(),
      remainingGasFreeTransactions: '1' 
    },
    { 
      id: "5",
      status: "refused",
      user: "0xa795376918902EAd9fb069fEe1B1D328A5545B85",
      username: "Bobby",
      requestDate: new Date().getTime(),
      remainingGasFreeTransactions: '0' 
    }
  ];

  return (
    <Card>
      <RecentGasFreeTransactionAllowanceRequestsTable gasFreeTransactionAllowanceRequests={gasFreeTransactionAllowanceRequests} />
    </Card>
  );
}

export default RecentGasFreeTransactionAllowanceRequests;
