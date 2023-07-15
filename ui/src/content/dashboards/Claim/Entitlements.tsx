import {
  Button,
  Card,
  Grid,
  Box,
  CardContent,
  Typography,
  Avatar,
  alpha,
  Tooltip,
  CardActionArea,
  styled
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    margin: ${theme.spacing(2, 0, 1, -0.5)};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${theme.spacing(1)};
    padding: ${theme.spacing(0.5)};
    border-radius: 60px;
    height: ${theme.spacing(5.5)};
    width: ${theme.spacing(5.5)};
    background: ${
      theme.palette.mode === 'dark'
        ? theme.colors.alpha.trueWhite[30]
        : alpha(theme.colors.alpha.black[100], 0.07)
    };
  
    img {
      background: ${theme.colors.alpha.trueWhite[100]};
      padding: ${theme.spacing(0.5)};
      display: block;
      border-radius: inherit;
      height: ${theme.spacing(4.5)};
      width: ${theme.spacing(4.5)};
    }
`
);

const AvatarAddWrapper = styled(Avatar)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[10]};
        color: ${theme.colors.primary.main};
        width: ${theme.spacing(8)};
        height: ${theme.spacing(8)};
`
);

const CardAddAction = styled(Card)(
  ({ theme }) => `
        border: ${theme.colors.primary.main} dashed 1px;
        height: 100%;
        color: ${theme.colors.primary.main};
        transition: ${theme.transitions.create(['all'])};
        
        .MuiCardActionArea-root {
          height: 100%;
          justify-content: center;
          align-items: center;
          display: flex;
        }
        
        .MuiTouchRipple-root {
          opacity: .2;
        }
        
        &:hover {
          border-color: ${theme.colors.alpha.black[70]};
        }
`
);

function Entitlements() {
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pb: 3
        }}
      >
        <Typography variant="h3">Wallets</Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddTwoToneIcon fontSize="small" />}
        >
          Add new Entitlement
        </Button>
      </Box>
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3} item>
          <Card
            sx={{
              px: 1
            }}
          >
            <CardContent>
              <AvatarWrapper>
                <img
                  alt="Housing"
                  src="/static/images/placeholders/logo/house.png"
                />
              </AvatarWrapper>
              <Typography variant="h5" noWrap>
                Housing
              </Typography>
              <Typography variant="subtitle1" noWrap>
                Housing Allowance
              </Typography>
              <Box
                sx={{
                  pt: 3
                }}
              >
                <Typography variant="h4" noWrap>
                  7 DBT Claimed
                </Typography>
                <Typography variant="h4" noWrap>
                  3 DBT Remaining
                </Typography>
              </Box>
              <Button
          size="small"
          variant="outlined"
          startIcon={<AddTwoToneIcon fontSize="small" />}
        >
          Claim
          </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3} item>
          <Card
            sx={{
              px: 1
            }}
          >
            <CardContent>
              <AvatarWrapper>
                <img
                  alt="Job Search"
                  src="/static/images/placeholders/logo/job.png"
                />
              </AvatarWrapper>
              <Typography variant="h5" noWrap>
                Job
              </Typography>
              <Typography variant="subtitle1" noWrap>
                Job Search Allowance
              </Typography>
              <Box
                sx={{
                  pt: 3
                }}
              >
                <Typography variant="h4" noWrap>
                 2 DBT Claimed
                </Typography>
                <Typography variant="h4" noWrap>
                  1 DBT Remaining
                </Typography>
                <Button
          size="small"
          variant="outlined"
          startIcon={<AddTwoToneIcon fontSize="small" />}
        >
          Claim
          </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3} item>
          <Card
            sx={{
              px: 1
            }}
          >
            <CardContent>
              <AvatarWrapper>
                <img
                  alt="Child Care"
                  src="/static/images/placeholders/logo/pediatrics.png"
                />
              </AvatarWrapper>
              <Typography variant="h5" noWrap>
                Child Care
              </Typography>
              <Typography variant="subtitle1" noWrap>
                Childcare Allowance
              </Typography>
              <Box
                sx={{
                  pt: 3
                }}
              >
                <Typography variant="h4" gutterBottom noWrap>
                  8 DBT Claimed
                </Typography>
                <Typography variant="h4" noWrap>
                  6 DBT Remaining 
                </Typography>
                <Button
          size="small"
          variant="outlined"
          startIcon={<AddTwoToneIcon fontSize="small" />}
        >
          Claim
          </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={3} item>
          <Tooltip arrow title="Click to add a new wallet">
            <CardAddAction>
              <CardActionArea
                sx={{
                  px: 1
                }}
              >
                <CardContent>
                  <AvatarAddWrapper>
                    <AddTwoToneIcon fontSize="large" />
                  </AvatarAddWrapper>
                </CardContent>
              </CardActionArea>
            </CardAddAction>
          </Tooltip>
        </Grid>
      </Grid>
    </>
  );
}

export default Entitlements;
