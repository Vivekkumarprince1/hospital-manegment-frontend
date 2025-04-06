import { useState } from 'react';
import {
  Grid, Typography, Paper, Card, CardContent,
  Box, Divider, Stack, Chip, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  FormControl, InputLabel, MenuItem, Select, TextField,
  IconButton, List, ListItem, ListItemText, Pagination,
  Alert, AlertTitle
} from '@mui/material';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AlarmIcon from '@mui/icons-material/Alarm';
import WarningIcon from '@mui/icons-material/Warning';
import SendIcon from '@mui/icons-material/Send';
import PrintIcon from '@mui/icons-material/Print';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SearchIcon from '@mui/icons-material/Search';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

function OverduePayments({ overdueData, overdueByAge }) {
  const [ageFilter, setAgeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get age range color
  const getAgeRangeColor = (daysOverdue) => {
    if (daysOverdue <= 30) return 'info';
    if (daysOverdue <= 60) return 'warning';
    if (daysOverdue <= 90) return 'error';
    return 'error';
  };

  // Filter overdue data based on search and filter
  const filteredOverdue = overdueData.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.billNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = ageFilter === 'all' || 
      (ageFilter === '0-30' && item.daysOverdue <= 30) ||
      (ageFilter === '31-60' && item.daysOverdue > 30 && item.daysOverdue <= 60) ||
      (ageFilter === '61-90' && item.daysOverdue > 60 && item.daysOverdue <= 90) ||
      (ageFilter === '90+' && item.daysOverdue > 90);
    
    return matchesSearch && matchesFilter;
  });

  // Calculate totals
  const totalOverdueAmount = overdueData.reduce((sum, item) => sum + item.amount, 0);
  const totalOverdueBills = overdueData.length;

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  // Calculate which rows to display
  const startIndex = (page - 1) * rowsPerPage;
  const displayedRows = filteredOverdue.slice(startIndex, startIndex + rowsPerPage);
  const pageCount = Math.ceil(filteredOverdue.length / rowsPerPage);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Overdue
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(totalOverdueAmount)}
              </Typography>
              <Typography color="text.secondary">
                {totalOverdueBills} overdue bills
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <WarningIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="body2">Pending Collection</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Critical (90+ days)
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                {formatCurrency(overdueByAge.find(item => item._id === '90+ days')?.amount || 0)}
              </Typography>
              <Typography color="text.secondary">
                {overdueByAge.find(item => item._id === '90+ days')?.count || 0} bills
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <AlarmIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="body2">Urgent Attention Required</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <Alert 
            severity="warning" 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center' 
            }}
          >
            <AlertTitle>Attention Required</AlertTitle>
            There are <strong>{overdueData.length}</strong> overdue bills that need immediate follow-up.
            Consider sending reminders or making collection calls.
          </Alert>
        </Grid>
        
        {/* Age Breakdown Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Overdue by Age
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={overdueByAge}
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
                  <Bar name="Amount Overdue" dataKey="amount" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Overdue Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Overdue Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={overdueByAge}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="_id"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {overdueByAge.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    labelFormatter={(name) => `Age Range: ${name}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Overdue Bills List */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Overdue Bills
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl sx={{ minWidth: 150 }} size="small">
                  <InputLabel id="age-filter-label">Filter by Age</InputLabel>
                  <Select
                    labelId="age-filter-label"
                    id="age-filter"
                    value={ageFilter}
                    label="Filter by Age"
                    onChange={(e) => setAgeFilter(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="0-30">0-30 days</MenuItem>
                    <MenuItem value="31-60">31-60 days</MenuItem>
                    <MenuItem value="61-90">61-90 days</MenuItem>
                    <MenuItem value="90+">90+ days</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  placeholder="Search patient or bill..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    endAdornment: <SearchIcon />
                  }}
                />
              </Box>
            </Box>
            <TableContainer>
              <Table aria-label="overdue bills table">
                <TableHead>
                  <TableRow>
                    <TableCell>Bill #</TableCell>
                    <TableCell>Patient</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Days Overdue</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayedRows.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell>{row.billNumber}</TableCell>
                      <TableCell>{row.patientName}</TableCell>
                      <TableCell>{formatDate(row.dueDate)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={`${row.daysOverdue} days`} 
                          color={getAgeRangeColor(row.daysOverdue)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{formatCurrency(row.amount)}</TableCell>
                      <TableCell>
                        <Chip 
                          label="Overdue" 
                          color="error" 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex' }}>
                          <IconButton size="small" title="Send Reminder Email">
                            <EmailIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" title="Print Statement">
                            <PrintIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" title="Make Collection Call">
                            <PhoneIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {displayedRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                          No overdue bills found matching your criteria
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {filteredOverdue.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination 
                  count={pageCount} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary" 
                />
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Collection Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Bulk Collection Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<EmailIcon />}
              >
                Send Bulk Reminders
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                startIcon={<PrintIcon />}
              >
                Print Statements
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<WarningIcon />}
              >
                Flag for Collections
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default OverduePayments; 