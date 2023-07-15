import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container, Grid } from '@mui/material';
import Footer from 'src/components/Footer';

import OutstandingBalance from './OutstandingBalance';
import Entitlements from './Entitlements';
import AccountSecurity from './AccountSecurity';
import WatchList from './WatchList';

function DashboardClaim() {
  return (
    <>
      <Helmet>
        <title>Benefit Entitlement Claim Dashboard</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={4}
        >
          <Grid item xs={12}>
            <OutstandingBalance />
          </Grid>
          <Grid item lg={8} xs={12}>
            <Entitlements />
          </Grid>
          <Grid item lg={4} xs={12}>
            <AccountSecurity />
          </Grid>
    
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default DashboardClaim;
