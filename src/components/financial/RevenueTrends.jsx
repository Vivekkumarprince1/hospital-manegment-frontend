import { useState } from 'react';
import {
  Grid, Typography, Paper, Card, CardContent,
  Box, Divider, Stack, Chip, Button,
  FormControl, InputLabel, MenuItem, Select,
  ToggleButton, ToggleButtonGroup
} from '@mui/material';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

function RevenueTrends({ revenueData }) {
  const [period, setPeriod] = useState('month');
  const [chartType, setChartType] = useState('line');

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Get data for current period
  const currentPeriodData = revenueData || [];

  // Calculate total revenue
  const totalRevenue = currentPeriodData.reduce((sum, item) => sum + item.revenue, 0);
  
  // Calculate average revenue
  const averageRevenue = currentPeriodData.length > 0 
    ? totalRevenue / currentPeriodData.length 
    : 0;
  
  // Calculate growth (mock data for example)
  const growthPercent = 12.5;
  const isPositiveGrowth = growthPercent >= 0;

  // Get quarterly breakdown (mock data for example)
  const quarterlyData = [
    { name: 'Q1', revenue: 120000 },
    { name: 'Q2', revenue: 145000 },
    { name: 'Q3', revenue: 135000 },
    { name: 'Q4', revenue: 160000 }
  ];

  // Get department revenue (mock data for example)
  const departmentData = [
    { name: 'Emergency', revenue: 75000 },
    { name: 'Outpatient', revenue: 120000 },
    { name: 'Inpatient', revenue: 180000 },
    { name: 'Laboratory', revenue: 45000 },
    { name: 'Pharmacy', revenue: 60000 },
    { name: 'Radiology', revenue: 55000 }
  ];

  // Handle period change
  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  // Handle chart type change
  const handleChartTypeChange = (event, newChartType) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  // Render chart based on type
  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart
            data={currentPeriodData}
            margin={{
              top: 5,
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
            <Bar name="Revenue" dataKey="revenue" fill="#8884d8" />
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart
            data={currentPeriodData}
            margin={{
              top: 5,
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
            <Area type="monotone" name="Revenue" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
          </AreaChart>
        );
      case 'line':
      default:
        return (
          <LineChart
            data={currentPeriodData}
            margin={{
              top: 5,
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
            <Line type="monotone" name="Revenue" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        );
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(totalRevenue)}
              </Typography>
              <Typography color="text.secondary">
                For selected period
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">Revenue Stream</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Average Revenue
              </Typography>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(averageRevenue)}
              </Typography>
              <Typography color="text.secondary">
                Per {period}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <CompareArrowsIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="body2">Average Performance</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Growth
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant="h4" 
                  component="div" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: isPositiveGrowth ? 'success.main' : 'error.main'
                  }}
                >
                  {isPositiveGrowth ? '+' : ''}{growthPercent}%
                </Typography>
                {isPositiveGrowth ? 
                  <TrendingUpIcon color="success" sx={{ ml: 1 }} /> : 
                  <TrendingDownIcon color="error" sx={{ ml: 1 }} />
                }
              </Box>
              <Typography color="text.secondary">
                Compared to previous period
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <CompareArrowsIcon color={isPositiveGrowth ? "success" : "error"} sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {isPositiveGrowth ? 'Positive Trend' : 'Negative Trend'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Period
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={period}
                  onChange={handlePeriodChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Period' }}
                >
                  <MenuItem value="week">Weekly</MenuItem>
                  <MenuItem value="month">Monthly</MenuItem>
                  <MenuItem value="quarter">Quarterly</MenuItem>
                  <MenuItem value="year">Yearly</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <DateRangeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">Select Time Period</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Revenue Trend Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Revenue Trends
              </Typography>
              <ToggleButtonGroup
                value={chartType}
                exclusive
                onChange={handleChartTypeChange}
                aria-label="chart type"
                size="small"
              >
                <ToggleButton value="line" aria-label="line chart">
                  <ShowChartIcon />
                </ToggleButton>
                <ToggleButton value="bar" aria-label="bar chart">
                  <BarChartIcon />
                </ToggleButton>
                <ToggleButton value="area" aria-label="area chart">
                  <PieChartIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Quarterly Breakdown */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Quarterly Breakdown
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={quarterlyData}
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
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar name="Revenue" dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        {/* Revenue by Department */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Revenue by Department
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="revenue"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    labelFormatter={(name) => `Department: ${name}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RevenueTrends;