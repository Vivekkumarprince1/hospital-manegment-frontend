import { useState, useEffect } from 'react';
import { 
  Container, Grid, Paper, Typography, Box, Tabs, Tab, 
  Button, Divider, CircularProgress, Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import BillingOverview from '../components/financial/BillingOverview';
import InsuranceClaims from '../components/financial/InsuranceClaims';
import RevenueTrends from '../components/financial/RevenueTrends';
import OverduePayments from '../components/financial/OverduePayments';
import axios from 'axios';

// Mock data for development and testing
const MOCK_DATA = {
  billing: {
    today: { totalBills: 8, totalAmount: 4800 },
    thisMonth: { totalBills: 124, totalAmount: 75000 },
    paymentMethodBreakdown: [
      { _id: 'Credit Card', count: 45, amount: 30000 },
      { _id: 'Insurance', count: 50, amount: 35000 },
      { _id: 'Cash', count: 20, amount: 8000 },
      { _id: 'Bank Transfer', count: 9, amount: 2000 }
    ],
    outstandingBills: [
      { _id: 'Unpaid', count: 30, totalAmount: 15000, outstandingAmount: 15000 },
      { _id: 'Partially Paid', count: 15, totalAmount: 12000, outstandingAmount: 7500 }
    ],
    overdueBills: 12,
    recentTransactions: [
      { _id: '1', billNumber: 'B-10045', patientName: 'John Doe', billDate: '2023-06-15', totalAmount: 1250, paymentStatus: 'Paid', paymentMethod: 'Credit Card' },
      { _id: '2', billNumber: 'B-10046', patientName: 'Jane Smith', billDate: '2023-06-15', totalAmount: 850, paymentStatus: 'Paid', paymentMethod: 'Insurance' },
      { _id: '3', billNumber: 'B-10047', patientName: 'Robert Brown', billDate: '2023-06-16', totalAmount: 1500, paymentStatus: 'Unpaid', paymentMethod: '' },
      { _id: '4', billNumber: 'B-10048', patientName: 'Emily Wilson', billDate: '2023-06-16', totalAmount: 750, paymentStatus: 'Partially Paid', paymentMethod: 'Cash' },
      { _id: '5', billNumber: 'B-10049', patientName: 'Michael Johnson', billDate: '2023-06-17', totalAmount: 2000, paymentStatus: 'Paid', paymentMethod: 'Bank Transfer' }
    ]
  },
  insurance: [
    { _id: 'Pending', count: 15, amount: 22500 },
    { _id: 'Submitted', count: 25, amount: 37500 },
    { _id: 'In Review', count: 10, amount: 15000 },
    { _id: 'Approved', count: 30, amount: 45000 },
    { _id: 'Denied', count: 5, amount: 7500 },
    { _id: 'Partially Approved', count: 8, amount: 12000 }
  ],
  revenue: [
    { _id: '2023-01', revenue: 40000, count: 65 },
    { _id: '2023-02', revenue: 38000, count: 60 },
    { _id: '2023-03', revenue: 42000, count: 68 },
    { _id: '2023-04', revenue: 45000, count: 70 },
    { _id: '2023-05', revenue: 48000, count: 75 },
    { _id: '2023-06', revenue: 52000, count: 80 }
  ],
  overdue: [
    { _id: '1', patientName: 'John Doe', billNumber: 'B001', amount: 1200, dueDate: '2023-05-01', daysOverdue: 45 },
    { _id: '2', patientName: 'Jane Smith', billNumber: 'B005', amount: 800, dueDate: '2023-05-10', daysOverdue: 36 },
    { _id: '3', patientName: 'Robert Brown', billNumber: 'B012', amount: 1500, dueDate: '2023-05-15', daysOverdue: 31 },
    { _id: '4', patientName: 'Emily Wilson', billNumber: 'B018', amount: 2000, dueDate: '2023-05-20', daysOverdue: 26 },
    { _id: '5', patientName: 'Michael Johnson', billNumber: 'B023', amount: 1300, dueDate: '2023-05-25', daysOverdue: 21 }
  ],
  overdueByAge: [
    { _id: '1-30 days', count: 8, amount: 6000 },
    { _id: '31-60 days', count: 5, amount: 4500 },
    { _id: '61-90 days', count: 3, amount: 2800 },
    { _id: '90+ days', count: 2, amount: 1700 }
  ]
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
  height: '100%',
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`financial-tabpanel-${index}`}
      aria-labelledby={`financial-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `financial-tab-${index}`,
    'aria-controls': `financial-tabpanel-${index}`,
  };
}

function FinancialDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [financialData, setFinancialData] = useState({
    billing: {},
    insurance: [],
    revenue: [],
    overdue: [],
    overdueByAge: []
  });

  useEffect(() => {
    const fetchFinancialDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch data from API
        let billingData = {};
        let insuranceData = [];
        let revenueData = [];
        let overdueData = [];
        let overdueByAgeData = [];
        let recentTransactionsData = [];
        
        try {
          // Get financial dashboard overview
          const dashboardResponse = await axios.get('/api/financial/dashboard');
          
          if (dashboardResponse && dashboardResponse.data && dashboardResponse.data.data) {
            billingData = {
              today: dashboardResponse.data.data.today,
              thisMonth: dashboardResponse.data.data.thisMonth,
              paymentMethodBreakdown: dashboardResponse.data.data.paymentMethodBreakdown,
              outstandingBills: dashboardResponse.data.data.outstandingBills,
              overdueBills: dashboardResponse.data.data.overdueBills
            };
            
            insuranceData = dashboardResponse.data.data.insuranceClaims || [];
            revenueData = dashboardResponse.data.data.revenueTrend || [];
            recentTransactionsData = dashboardResponse.data.data.recentTransactions || [];
            
            // Add recent transactions to billing data
            billingData.recentTransactions = recentTransactionsData;
          } else {
            console.warn('Dashboard API response format unexpected:', dashboardResponse);
            throw new Error('Invalid API response format');
          }
        } catch (err) {
          console.warn('Failed to fetch dashboard data, using mock data', err);
          billingData = MOCK_DATA.billing;
          insuranceData = MOCK_DATA.insurance;
          revenueData = MOCK_DATA.revenue;
        }
        
        try {
          // Get overdue bills
          const overdueResponse = await axios.get('/api/financial/overdue');
          if (overdueResponse && overdueResponse.data) {
            overdueData = overdueResponse.data.data || [];
            overdueByAgeData = overdueResponse.data.summary?.overdueByAge || [];
          }
        } catch (err) {
          console.warn('Failed to fetch overdue data, using mock data', err);
          overdueData = MOCK_DATA.overdue;
          overdueByAgeData = MOCK_DATA.overdueByAge;
        }
        
        setFinancialData({
          billing: billingData,
          insurance: insuranceData,
          revenue: revenueData,
          overdue: overdueData,
          overdueByAge: overdueByAgeData
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching financial dashboard data:', err);
        setError(err.message || 'Failed to load financial data');
        // Fall back to mock data completely if all else fails
        setFinancialData({
          billing: MOCK_DATA.billing,
          insurance: MOCK_DATA.insurance,
          revenue: MOCK_DATA.revenue,
          overdue: MOCK_DATA.overdue,
          overdueByAge: MOCK_DATA.overdueByAge
        });
        setLoading(false);
      }
    };
    
    fetchFinancialDashboardData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Financial Dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Financial Dashboard
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          mb: 4,
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="financial dashboard tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Billing Overview" {...a11yProps(0)} />
            <Tab label="Insurance Claims" {...a11yProps(1)} />
            <Tab label="Revenue Trends" {...a11yProps(2)} />
            <Tab label="Overdue Payments" {...a11yProps(3)} />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <BillingOverview billingData={financialData.billing || {}} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <InsuranceClaims insuranceData={financialData.insurance || []} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <RevenueTrends revenueData={financialData.revenue || []} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <OverduePayments 
            overdueData={financialData.overdue || []} 
            overdueByAge={financialData.overdueByAge || []} 
          />
        </TabPanel>
      </Paper>
    </Container>
  );
}

export default FinancialDashboard; 