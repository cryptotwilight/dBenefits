import { Helmet } from 'react-helmet-async';
import { useState } from 'react';

import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Footer from 'src/components/Footer';

import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';


import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Divider
} from '@mui/material';
import Box from '@mui/material/Box';

const benefits = [
  {
    value: 'housing',
    label: 'Housing'
  },
  {
    value: 'jobs',
    label: 'Jobs'
  },
  {
    value: 'childcare',
    label: 'Child Care'
  },
  {
    value: 'transport',
    label: 'Transport'
  }
];

function DashboardEntitlementRequest() {
  const [benefit, setBenefit] = useState('housing');

  const handleChange = (event) => {
    setBenefit(event.target.value);
  };

  const [value, setValue] = useState(30);

  const handleChange2 = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Helmet>
        <title>Entitlement Request Dashboard</title>
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
            <Card>
              <CardHeader title="Request Entitlement" />
              <Divider />
              <CardContent>
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' }
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <div>
                    <TextField
                      required
                      id="outlined-required"
                      label="Required"
                      helperText="Beneficiary Name"
                      defaultValue="Enter your name"
                    />
                    <TextField
                      id="outlined-select-currency"
                      select
                      label="Select"
                      value={benefit}
                      onChange={handleChange}
                      helperText="Please select benefit type"
                    >
                      {benefits.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>

                    <Button
                  sx={{ margin: 1 }}
                  variant="contained"
                  color="secondary"
                >
                  Request Benefit Entitlement
                </Button>
                 
        


                  </div>

                </Box>
              </CardContent>
            </Card>
          </Grid>
        
     
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default DashboardEntitlementRequest;
