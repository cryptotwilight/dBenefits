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
import { GasFreeTransactionAllowanceRequest, GasFreeTransactionAllowanceRequestStatus } from 'src/models/gas_free_transaction_allowance_request';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
import BulkActions from './BulkActions';

interface RecentOrdersTableProps {
  className?: string;
  gasFreeTransactionAllowanceRequests: GasFreeTransactionAllowanceRequest[];
}

interface Filters {
  status?: GasFreeTransactionAllowanceRequestStatus;
}

const getStatusLabel = (gasFreeTransactionAllowanceRequestStatus: GasFreeTransactionAllowanceRequestStatus): JSX.Element => {
  const map = {
    refused: {
      text: 'Refused',
      color: 'error'
    },
    permitted: {
      text: 'Permitted',
      color: 'success'
    },
    outstanding: {
      text: 'Outstanding',
      color: 'warning'
    }
  };

  const { text, color }: any = map[gasFreeTransactionAllowanceRequestStatus];

  return <Label color={color}>{text}</Label>;
};

const applyFilters = (
  gasFreeTransactionAllowanceRequests: GasFreeTransactionAllowanceRequest[],
  filters: Filters
): GasFreeTransactionAllowanceRequest[] => {
  return gasFreeTransactionAllowanceRequests.filter((gasFreeTransactionAllowanceRequest) => {
    let matches = true;

    if (filters.status && gasFreeTransactionAllowanceRequest.status !== filters.status) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (
  gasFreeTransactionAllowanceRequests: GasFreeTransactionAllowanceRequest[],
  page: number,
  limit: number
): GasFreeTransactionAllowanceRequest[] => {
  return gasFreeTransactionAllowanceRequests.slice(page * limit, page * limit + limit);
};

const RecentGasFreeTransactionAllowanceRequestTable: FC<RecentOrdersTableProps> = ({gasFreeTransactionAllowanceRequests}) => {
  const [selectedGasFreeTransactionAllowanceRequests, setSelectedGasFreeTransactionAllowanceRequests] = useState<string[]>(
    []
  );
  const selectedBulkActions = selectedGasFreeTransactionAllowanceRequests.length > 0;
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
      id: 'permitted',
      name: 'Permitted'
    },
    {
      id: 'outstanding',
      name: 'Outstanding'
    },
    {
      id: 'refused',
      name: 'Refused'
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

  const handleSelectAllGasFreeTransactionAllowanceRequests = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedGasFreeTransactionAllowanceRequests(
      event.target.checked
        ? gasFreeTransactionAllowanceRequests.map((gasFreeTransactionAllowanceRequest) => gasFreeTransactionAllowanceRequest.id)
        : []
    );
  };

  const handleSelectOneGasFreeTransactionAllowanceRequest = (
    event: ChangeEvent<HTMLInputElement>,
    gasFreeTransactionAllowanceRequestId: string
  ): void => {
    if (!selectedGasFreeTransactionAllowanceRequests.includes(gasFreeTransactionAllowanceRequestId)) {
      setSelectedGasFreeTransactionAllowanceRequests((prevSelected) => [
        ...prevSelected,
        gasFreeTransactionAllowanceRequestId
      ]);
    } else {
      setSelectedGasFreeTransactionAllowanceRequests((prevSelected) =>
        prevSelected.filter((id) => id !== gasFreeTransactionAllowanceRequestId)
      );
    }
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredGasFreeTransactionAllowanceRequests = applyFilters(gasFreeTransactionAllowanceRequests, filters);
  const paginatedGasFreeTransactionAllowanceRequests = applyPagination(
    filteredGasFreeTransactionAllowanceRequests,
    page,
    limit
  );
  const selectedSomeGasFreeTransactionAllowanceRequests =
    selectedGasFreeTransactionAllowanceRequests.length > 0 &&
    selectedGasFreeTransactionAllowanceRequests.length < gasFreeTransactionAllowanceRequests.length;
  const selectedAllGasFreeTransactionAllowanceRequests =
    selectedGasFreeTransactionAllowanceRequests.length === gasFreeTransactionAllowanceRequests.length;
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
          title="Gas Free Transaction Allowance Requests"
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
                  checked={selectedAllGasFreeTransactionAllowanceRequests}
                  indeterminate={selectedSomeGasFreeTransactionAllowanceRequests}
                  onChange={handleSelectAllGasFreeTransactionAllowanceRequests}
                />
              </TableCell>
              <TableCell>User</TableCell>
              <TableCell>Request Date</TableCell>
              <TableCell>Remaining Gas Free Transactions</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedGasFreeTransactionAllowanceRequests.map((gasFreeTransactionAllowanceRequest) => {
              const isGasFreeTransactionAllowanceRequestSelected = selectedGasFreeTransactionAllowanceRequests.includes(
                gasFreeTransactionAllowanceRequest.id
              );
              return (
                <TableRow
                  hover
                  key={gasFreeTransactionAllowanceRequest.id}
                  selected={isGasFreeTransactionAllowanceRequestSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isGasFreeTransactionAllowanceRequestSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneGasFreeTransactionAllowanceRequest(event, gasFreeTransactionAllowanceRequest.id)
                      }
                      value={isGasFreeTransactionAllowanceRequestSelected}
                    />
                  </TableCell>
                  <TableCell>
                  <Typography variant="body2" color="text.secondary" noWrap>
                      {gasFreeTransactionAllowanceRequest.username}
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {gasFreeTransactionAllowanceRequest.user}
                    </Typography>
           
                  </TableCell>
                  <TableCell>
                  <Typography variant="body2" color="text.secondary" noWrap>
                      {format(gasFreeTransactionAllowanceRequest.requestDate, 'MMMM dd yyyy')}
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
                      {gasFreeTransactionAllowanceRequest.remainingGasFreeTransactions}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {getStatusLabel(gasFreeTransactionAllowanceRequest.status)}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Permit Allowance" arrow>
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
                        <CheckCircleTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Refuse Request" arrow>
                      <IconButton
                        sx={{
                          '&:hover': { background: theme.colors.error.lighter },
                          color: theme.palette.error.main
                        }}
                        color="inherit"
                        size="small"
                      >
                        <CancelTwoToneIcon fontSize="small" />
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
          count={filteredGasFreeTransactionAllowanceRequests.length}
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

RecentGasFreeTransactionAllowanceRequestTable.propTypes = {
  gasFreeTransactionAllowanceRequests: PropTypes.array.isRequired
};

RecentGasFreeTransactionAllowanceRequestTable.defaultProps = {
  gasFreeTransactionAllowanceRequests: []
};

export default RecentGasFreeTransactionAllowanceRequestTable;
