import { Typography, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function PageHeader() {
  
  const theme = useTheme();

  return (
    <Grid container alignItems="center">

      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Welcome, to Decentralized Benefits 
        </Typography>
        <Typography variant="subtitle2">
          Request a benefit to claim
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
