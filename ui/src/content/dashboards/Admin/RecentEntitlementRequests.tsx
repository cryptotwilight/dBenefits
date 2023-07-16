import { Card } from '@mui/material';
import { BenefitEntitlementRequest } from 'src/models/benefit_entitlement_request';
import RecentEntitlementRequestsTable from './RecentEntitlementRequestsTable';
import { subDays } from 'date-fns';

function RecentEntitlementRequests() {
  const benefitEntitlementRequests: BenefitEntitlementRequest[] = [
    {
      id: '1',
      status: 'pending',
      user: '0xa795376918902EAd9fb069fEe1B1D328A5545B85',
      username : 'Mary',
      requestDate: new Date().getTime(),
      benefitType: 'housing' 
    },
    {
      id: '2',
      status: 'pending',
      user: '0xa795376918902EAd9fb069fEe1B1D328A5545B85',
      username : 'John',
      requestDate: new Date().getTime(),
      benefitType: 'jobs' 
    },
    {
      id: '3',
      status: 'pending',
      user: '0xa795376918902EAd9fb069fEe1B1D328A5545B85',
      username : 'Tina',
      requestDate: new Date().getTime(),
      benefitType: 'housing' 
    },
    {
      id: '4',
      status: 'pending',
      user: '0xa795376918902EAd9fb069fEe1B1D328A5545B85',
      username : 'Tom',
      requestDate: new Date().getTime(),
      benefitType: 'Transport' 
    },
    {
      id: '1',
      status: 'pending',
      user: '0xa795376918902EAd9fb069fEe1B1D328A5545B85',
      username : 'Jenny',
      requestDate: new Date().getTime(),
      benefitType: 'childcare' 
    }
   ];

  return (
    <Card>
      <RecentEntitlementRequestsTable benefitEntitlementRequests={benefitEntitlementRequests} />
    </Card>
  );
}

export default RecentEntitlementRequests;
