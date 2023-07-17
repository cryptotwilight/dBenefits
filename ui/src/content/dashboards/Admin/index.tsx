import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Container, Grid } from '@mui/material';
import Footer from 'src/components/Footer';


import RecentEntitlementRequests from './RecentEntitlementRequests';
import RecentGasFreeTransactionAllowanceRequests from './RecentGasFreeTransactionAllowanceRequests';


function DashboardAdmin() {
  return (
    <>
      <Helmet>
        <title>Benefit Entitlement Admin Dashboard</title>
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
            <RecentEntitlementRequests />
          </Grid>
          <Grid item lg={12} xs={12}>
            <RecentGasFreeTransactionAllowanceRequests />
          </Grid>
       
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default DashboardAdmin;
