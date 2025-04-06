import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  TextField,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  Container
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [summary, setSummary] = useState({
    totalBilled: 0,
    totalPaid: 0,
    totalBalance: 0
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  // Format date string for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status chip with appropriate color
  const getStatusChip = (status) => {
    let color = 'default';
    
    switch(status) {
      case 'Paid':
        color = 'success';
        break;
      case 'Unpaid':
        color = 'error';
        break;
      case 'Partially Paid':
        color = 'warning';
        break;
      case 'Overdue':
        color = 'error';
        break;
      default:
        color = 'default';
    }
    
    return <Chip label={status || 'Unknown'} color={color} size="small" />;
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, rowsPerPage, searchQuery, statusFilter, startDate, endDate]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = {
        page: page + 1,
        limit: rowsPerPage
      };
      
      if (searchQuery) params.search = searchQuery;
      if (statusFilter) params.paymentStatus = statusFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      // Make API call to get transactions
      try {
        const response = await axios.get('/api/billing', { params });
        
        if (response.data.success) {
          setTransactions(response.data.data || []);
          setTotalTransactions(response.data.total || 0);
          setSummary(response.data.summary || {
            totalBilled: 0,
            totalPaid: 0,
            totalBalance: 0
          });
        } else {
          // Fallback to empty state if API call is unsuccessful
          setTransactions([]);
          setTotalTransactions(0);
          setSummary({
            totalBilled: 0,
            totalPaid: 0,
            totalBalance: 0
          });
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        
        // Set mock data for development/testing
        const mockData = [
          { _id: '1', billNumber: 'B-10045', patientId: { firstName: 'John', lastName: 'Doe' }, billDate: '2023-06-15', totalAmount: 1250, paidAmount: 1250, paymentStatus: 'Paid', paymentMethod: 'Credit Card' },
          { _id: '2', billNumber: 'B-10046', patientId: { firstName: 'Jane', lastName: 'Smith' }, billDate: '2023-06-15', totalAmount: 850, paidAmount: 850, paymentStatus: 'Paid', paymentMethod: 'Insurance' },
          { _id: '3', billNumber: 'B-10047', patientId: { firstName: 'Robert', lastName: 'Brown' }, billDate: '2023-06-16', totalAmount: 1500, paidAmount: 0, paymentStatus: 'Unpaid', paymentMethod: '' },
          { _id: '4', billNumber: 'B-10048', patientId: { firstName: 'Emily', lastName: 'Wilson' }, billDate: '2023-06-16', totalAmount: 750, paidAmount: 350, paymentStatus: 'Partially Paid', paymentMethod: 'Cash' },
          { _id: '5', billNumber: 'B-10049', patientId: { firstName: 'Michael', lastName: 'Johnson' }, billDate: '2023-06-17', totalAmount: 2000, paidAmount: 2000, paymentStatus: 'Paid', paymentMethod: 'Bank Transfer' }
        ];
        
        setTransactions(mockData);
        setTotalTransactions(mockData.length);
        setSummary({
          totalBilled: mockData.reduce((sum, item) => sum + item.totalAmount, 0),
          totalPaid: mockData.reduce((sum, item) => sum + item.paidAmount, 0),
          totalBalance: mockData.reduce((sum, item) => sum + (item.totalAmount - item.paidAmount), 0)
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setTransactions([]);
      setTotalTransactions(0);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Billing Transactions
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Billed
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(summary.totalBilled)}
              </Typography>
              <Typography color="text.secondary">
                {totalTransactions} transactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Paid
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {formatCurrency(summary.totalPaid)}
              </Typography>
              <Typography color="text.secondary">
                Collected payments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Balance Due
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                {formatCurrency(summary.totalBalance)}
              </Typography>
              <Typography color="text.secondary">
                Outstanding amount
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Filter Controls */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              fullWidth
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Patient name, bill #"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Payment Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="Payment Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Partially Paid">Partially Paid</MenuItem>
                <MenuItem value="Unpaid">Unpaid</MenuItem>
                <MenuItem value="Overdue">Overdue</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Start Date"
              type="date"
              size="small"
              fullWidth
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="End Date"
              type="date"
              size="small"
              fullWidth
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Transactions Table */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                <TableCell>Bill #</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Method</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                      <CircularProgress />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No transactions found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => {
                  const balance = transaction.totalAmount - transaction.paidAmount;
                  
                  return (
                    <TableRow hover key={transaction._id}>
                      <TableCell>{transaction.billNumber}</TableCell>
                      <TableCell>
                        {transaction.patientId 
                          ? `${transaction.patientId.firstName} ${transaction.patientId.lastName}`
                          : 'Unknown Patient'}
                      </TableCell>
                      <TableCell>{formatDate(transaction.billDate)}</TableCell>
                      <TableCell>{formatCurrency(transaction.totalAmount)}</TableCell>
                      <TableCell>{formatCurrency(transaction.paidAmount)}</TableCell>
                      <TableCell>{formatCurrency(balance)}</TableCell>
                      <TableCell>{getStatusChip(transaction.paymentStatus)}</TableCell>
                      <TableCell>{transaction.paymentMethod || "--"}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalTransactions}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
}

export default TransactionsPage; 