import { useState } from 'react';
import {
  Grid, Typography, Paper, Card, CardContent,
  Box, Divider, Stack, Chip, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  FormControl, InputLabel, MenuItem, Select,
  LinearProgress
} from '@mui/material';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

function InsuranceClaims({ insuranceData }) {
  const [statusFilter, setStatusFilter] = useState('all');

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Get appropriate color for status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Denied':
        return 'error';
      case 'Partially Approved':
        return 'warning';
      case 'Pending':
      case 'Submitted':
      case 'In Review':
        return 'info';
      default:
        return 'default';
    }
  };

  // Calculate totals
  const totalSubmitted = insuranceData.reduce((sum, item) => sum + item.amount, 0);
  const totalClaims = insuranceData.reduce((sum, item) => sum + item.count, 0);
  
  // Group claims by status for pie chart
  const statusData = insuranceData || [];

  // Calculate aging breakdown for bar chart
  const agingData = [
    { name: '0-30 days', pending: 12, approved: 25, denied: 3 },
    { name: '31-60 days', pending: 8, approved: 15, denied: 5 },
    { name: '61-90 days', pending: 5, approved: 8, denied: 7 },
    { name: '90+ days', pending: 3, approved: 4, denied: 10 }
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Claims
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {totalClaims}
              </Typography>
              <Typography color="text.secondary">
                All insurance claims
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">Total Processing</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Amount Claimed
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(totalSubmitted)}
              </Typography>
              <Typography color="text.secondary">
                All submitted claims
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">Pending Insurance Review</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Claims Approved
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {statusData.find(item => item._id === 'Approved')?.count || 0}
              </Typography>
              <Typography color="text.secondary">
                {formatCurrency(statusData.find(item => item._id === 'Approved')?.amount || 0)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="body2">Successfully Processed</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Claims Denied
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {statusData.find(item => item._id === 'Denied')?.count || 0}
              </Typography>
              <Typography color="text.secondary">
                {formatCurrency(statusData.find(item => item._id === 'Denied')?.amount || 0)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <ErrorIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="body2">Needs Follow-up</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Status Breakdown Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Claims by Status
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="_id"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    labelFormatter={(name) => `Status: ${name}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Aging Breakdown Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Claims Aging
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={agingData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => value} />
                  <Legend />
                  <Bar name="Pending" dataKey="pending" stackId="a" fill="#0088FE" />
                  <Bar name="Approved" dataKey="approved" stackId="a" fill="#00C49F" />
                  <Bar name="Denied" dataKey="denied" stackId="a" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Claims List */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Recent Insurance Claims
              </Typography>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="status-filter-label">Filter by Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  value={statusFilter}
                  label="Filter by Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  size="small"
                >
                  <MenuItem value="all">All Claims</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="denied">Denied</MenuItem>
                  <MenuItem value="inreview">In Review</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="insurance claims table">
                <TableHead>
                  <TableRow>
                    <TableCell>Claim #</TableCell>
                    <TableCell>Patient</TableCell>
                    <TableCell>Provider</TableCell>
                    <TableCell>Submission Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Age (days)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Sample data - In a real app, this would come from the API */}
                  <TableRow>
                    <TableCell>IC-10045</TableCell>
                    <TableCell>John Doe</TableCell>
                    <TableCell>Blue Cross</TableCell>
                    <TableCell>June 1, 2023</TableCell>
                    <TableCell>{formatCurrency(1250)}</TableCell>
                    <TableCell>
                      <Chip 
                        icon={<PendingIcon />} 
                        label="In Review" 
                        color="info" 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>17</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>IC-10046</TableCell>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>Aetna</TableCell>
                    <TableCell>May 20, 2023</TableCell>
                    <TableCell>{formatCurrency(850)}</TableCell>
                    <TableCell>
                      <Chip 
                        icon={<CheckCircleIcon />} 
                        label="Approved" 
                        color="success" 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>29</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>IC-10047</TableCell>
                    <TableCell>Robert Brown</TableCell>
                    <TableCell>Cigna</TableCell>
                    <TableCell>June 5, 2023</TableCell>
                    <TableCell>{formatCurrency(1500)}</TableCell>
                    <TableCell>
                      <Chip 
                        icon={<PendingIcon />} 
                        label="Submitted" 
                        color="info" 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>13</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>IC-10048</TableCell>
                    <TableCell>Emily Wilson</TableCell>
                    <TableCell>UnitedHealth</TableCell>
                    <TableCell>May 10, 2023</TableCell>
                    <TableCell>{formatCurrency(750)}</TableCell>
                    <TableCell>
                      <Chip 
                        icon={<ErrorIcon />} 
                        label="Denied" 
                        color="error" 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>39</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>IC-10049</TableCell>
                    <TableCell>Michael Johnson</TableCell>
                    <TableCell>Humana</TableCell>
                    <TableCell>June 2, 2023</TableCell>
                    <TableCell>{formatCurrency(2000)}</TableCell>
                    <TableCell>
                      <Chip 
                        icon={<CheckCircleIcon />} 
                        label="Partially Approved" 
                        color="warning" 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>16</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="outlined">View All Claims</Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default InsuranceClaims; 