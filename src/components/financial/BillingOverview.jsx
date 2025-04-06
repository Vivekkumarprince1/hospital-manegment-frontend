import { useState } from 'react';
import {
  Grid, Typography, Paper, Card, CardContent,
  Box, Divider, Stack, Chip, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  FormControl, InputLabel, MenuItem, Select,
  CircularProgress
} from '@mui/material';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentsIcon from '@mui/icons-material/Payments';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { Link } from 'react-router-dom';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

function BillingOverview({ billingData }) {
  const [period, setPeriod] = useState('today');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  // Get payment status chip
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
    
    return <Chip label={status} color={color} size="small" />;
  };

  // Prepare data for payment method chart
  const paymentMethodData = billingData.paymentMethodBreakdown || [];
  
  // Calculate outstanding total
  const outstandingTotal = billingData.outstandingBills ? 
    billingData.outstandingBills.reduce((sum, item) => sum + (item.outstandingAmount || 0), 0) : 0;

  const outstandingCount = billingData.outstandingBills ? 
    billingData.outstandingBills.reduce((sum, item) => sum + item.count, 0) : 0;

  // Get recent transactions from billing data or use empty array if not available
  const recentTransactions = billingData?.recentTransactions || [];

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error" variant="h6">Error loading billing data</Typography>
        <Typography color="error">{error.message}</Typography>
      </Box>
    );
  }

  try {
    return (
      <Box>
        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Today's Billing
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(billingData?.today?.totalAmount || 0)}
                </Typography>
                <Typography color="text.secondary">
                  {billingData?.today?.totalBills || 0} bills generated
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <ReceiptIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="body2">Daily Revenue</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Month-to-Date Billing
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(billingData.thisMonth?.totalAmount || 0)}
                </Typography>
                <Typography color="text.secondary">
                  {billingData.thisMonth?.totalBills || 0} bills generated
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <AttachMoneyIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2">Monthly Revenue</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Outstanding Amount
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {formatCurrency(outstandingTotal)}
                </Typography>
                <Typography color="text.secondary">
                  {outstandingCount} unpaid bills
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <PaymentsIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="body2">Needs Collection</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Overdue Bills
                </Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {billingData.overdueBills || 0}
                </Typography>
                <Typography color="text.secondary">
                  Past due date
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <LocalAtmIcon color="error" sx={{ mr: 1 }} />
                  <Typography variant="body2">Requires Immediate Action</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Payment Method Distribution */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Payment Method Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="amount"
                      nameKey="_id"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      labelFormatter={(name) => `Payment Method: ${name}`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
          
          {/* Outstanding Bills */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Outstanding Bills
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={billingData.outstandingBills || []}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar name="Outstanding Amount" dataKey="outstandingAmount" fill="#FF8042" />
                    <Bar name="Total Billed" dataKey="totalAmount" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
          
          {/* Recent Transactions */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Recent Transactions
                </Typography>
                <Button variant="outlined" size="small" component={Link} to="/financial/transactions">
                  View All Transactions
                </Button>
              </Box>
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="recent transactions table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Bill #</TableCell>
                      <TableCell>Patient</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Method</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <CircularProgress size={24} sx={{ my: 2 }} />
                        </TableCell>
                      </TableRow>
                    ) : recentTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No recent transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentTransactions.map((transaction) => (
                        <TableRow key={transaction._id}>
                          <TableCell>{transaction.billNumber}</TableCell>
                          <TableCell>{transaction.patientName}</TableCell>
                          <TableCell>{formatDate(transaction.billDate)}</TableCell>
                          <TableCell>{formatCurrency(transaction.totalAmount)}</TableCell>
                          <TableCell>
                            {getStatusChip(transaction.paymentStatus)}
                          </TableCell>
                          <TableCell>{transaction.paymentMethod || "--"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  } catch (err) {
    console.error('Error rendering BillingOverview:', err);
    setError(err);
    return (
      <Box p={3}>
        <Typography color="error" variant="h6">Something went wrong</Typography>
        <Typography color="error">Please try refreshing the page</Typography>
      </Box>
    );
  }
}

export default BillingOverview;
