import { FC, ChangeEvent, useState } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader
} from '@mui/material';

import Label from 'src/components/Label';
import { BenefitEntitlementRequest, BenefitEntitlementRequestStatus } from 'src/models/benefit_entitlement_request';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import ClearTwoToneIcon from '@mui/icons-material/ClearTwoTone';
import BulkActions from './BulkActions';

interface RecentOrdersTableProps {
  className?: string;
  benefitEntitlementRequests: BenefitEntitlementRequest[];
}

interface Filters {
  status?: BenefitEntitlementRequestStatus;
}

const getStatusLabel = (benefitEntitlementRequestStatus: BenefitEntitlementRequestStatus): JSX.Element => {
  const map = {
    failed: {
      text: 'declined',
      color: 'error'
    },
    completed: {
      text: 'granted',
      color: 'success'
    },
    pending: {
      text: 'Pending',
      color: 'warning'
    }
  };

  const { text, color }: any = map[benefitEntitlementRequestStatus];

  return <Label color={color}>{text}</Label>;
};

const applyFilters = (
  benefitEntitlementRequests: BenefitEntitlementRequest[],
  filters: Filters
): BenefitEntitlementRequest[] => {
  return benefitEntitlementRequests.filter((benefitEntitlementRequest) => {
    let matches = true;

    if (filters.status && benefitEntitlementRequest.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (
  benefitEntitlementRequests: BenefitEntitlementRequest[],
  page: number,
  limit: number
): BenefitEntitlementRequest[] => {
  return benefitEntitlementRequests.slice(page * limit, page * limit + limit);
};

const RecentEntitlementRequestsTable: FC<RecentOrdersTableProps> = ({ benefitEntitlementRequests }) => {
  const [selectedBenefitEntitlementRequests, setSelectedBenefitEntitlementRequests] = useState<string[]>(
    []
  );
  const selectedBulkActions = selectedBenefitEntitlementRequests.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: null
  });

  const statusOptions = [
    {
      id: 'all',
      name: 'All'
    },
    {
      id: 'granted',
      name: 'Granted'
    },
    {
      id: 'pending',
      name: 'Pending'
    },
    {
      id: 'declined',
      name: 'Declined'
    }
  ];

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value
    }));
  };

  const handleSelectAllBenefitEntitlementRequests = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedBenefitEntitlementRequests(
      event.target.checked
        ? benefitEntitlementRequests.map((benefitEntitlementRequest) => benefitEntitlementRequest.id)
        : []
    );
  };

  const handleSelectOneBenefitEntitlementRequest = (
    event: ChangeEvent<HTMLInputElement>,
    benefitEntitlementRequestId: string
  ): void => {
    if (!selectedBenefitEntitlementRequests.includes(benefitEntitlementRequestId)) {
      setSelectedBenefitEntitlementRequests((prevSelected) => [
        ...prevSelected,
        benefitEntitlementRequestId
      ]);
    } else {
      setSelectedBenefitEntitlementRequests((prevSelected) =>
        prevSelected.filter((id) => id !== benefitEntitlementRequestId)
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredBenefitEntitlementRequests = applyFilters(benefitEntitlementRequests, filters);
  const paginatedBenefitEntitlementRequests = applyPagination(
    filteredBenefitEntitlementRequests,
    page,
    limit
  );
  const selectedSomeBenefitEntitlementRequests =
    selectedBenefitEntitlementRequests.length > 0 &&
    selectedBenefitEntitlementRequests.length < benefitEntitlementRequests.length;
  const selectedAllBenefitEntitlementRequests =
    selectedBenefitEntitlementRequests.length === benefitEntitlementRequests.length;
  const theme = useTheme();

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions />
        </Box>
      )}
      {!selectedBulkActions && (
        <CardHeader
          action={
            <Box width={150}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || 'all'}
                  onChange={handleStatusChange}
                  label="Status"
                  autoWidth
                >
                  {statusOptions.map((statusOption) => (
                    <MenuItem key={statusOption.id} value={statusOption.id}>
                      {statusOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          }
          title="Recent Entitlement Requests"
        />
      )}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllBenefitEntitlementRequests}
                  indeterminate={selectedSomeBenefitEntitlementRequests}
                  onChange={handleSelectAllBenefitEntitlementRequests}
                />
              </TableCell>
              <TableCell>User</TableCell>
              <TableCell>Benefit Type</TableCell>
              <TableCell>Request Date</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBenefitEntitlementRequests.map((benefitEntitlementRequest) => {
              const isBenefitEntitlementRequestSelected = selectedBenefitEntitlementRequests.includes(
                benefitEntitlementRequest.id
              );
              return (
                <TableRow
                  hover
                  key={benefitEntitlementRequest.id}
                  selected={isBenefitEntitlementRequestSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isBenefitEntitlementRequestSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneBenefitEntitlementRequest(event, benefitEntitlementRequest.id)
                      }
                      value={isBenefitEntitlementRequestSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {benefitEntitlementRequest.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {benefitEntitlementRequest.user}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {benefitEntitlementRequest.benefitType}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {format(benefitEntitlementRequest.requestDate, 'MMMM dd yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {getStatusLabel(benefitEntitlementRequest.status)}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Grant Entitlement" arrow>
                      <IconButton
                        sx={{
                          '&:hover': {
                            background: theme.colors.primary.lighter
                          },
                          color: theme.palette.primary.main
                        }}
                        color="inherit"
                        size="small"
                      >
                        <CheckTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Decline Entitlement" arrow>
                      <IconButton
                        sx={{
                          '&:hover': { background: theme.colors.error.lighter },
                          color: theme.palette.error.main
                        }}
                        color="inherit"
                        size="small"
                      >
                        <ClearTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={filteredBenefitEntitlementRequests.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

RecentEntitlementRequestsTable.propTypes = {
  benefitEntitlementRequests: PropTypes.array.isRequired
};

RecentEntitlementRequestsTable.defaultProps = {
  benefitEntitlementRequests: []
};

export default RecentEntitlementRequestsTable;
