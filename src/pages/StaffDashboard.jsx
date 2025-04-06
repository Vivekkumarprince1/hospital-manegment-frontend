import { useState, useEffect } from 'react';
import { 
  Container, Grid, Paper, Typography, Box, Tabs, Tab, 
  Button, Divider, CircularProgress, Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import StaffRoster from '../components/staff/StaffRoster';
import AttendanceTracking from '../components/staff/AttendanceTracking';
import DepartmentOverview from '../components/staff/DepartmentOverview';
import StaffNotifications from '../components/staff/StaffNotifications';
import axios from 'axios';

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
      id={`staff-tabpanel-${index}`}
      aria-labelledby={`staff-tab-${index}`}
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
    id: `staff-tab-${index}`,
    'aria-controls': `staff-tabpanel-${index}`,
  };
}

// Mock data for development and testing
const MOCK_DATA = {
  roster: [
    { _id: '1', firstName: 'John', lastName: 'Doe', department: 'Nursing', position: 'Head Nurse', email: 'john.doe@hospital.com', contactNumber: '555-1234', isActive: true },
    { _id: '2', firstName: 'Jane', lastName: 'Smith', department: 'Administration', position: 'Admin Assistant', email: 'jane.smith@hospital.com', contactNumber: '555-5678', isActive: true },
    { _id: '3', firstName: 'Michael', lastName: 'Johnson', department: 'Laboratory', position: 'Lab Technician', email: 'michael.j@hospital.com', contactNumber: '555-9012', isActive: true },
    { _id: '4', firstName: 'Sarah', lastName: 'Williams', department: 'Pharmacy', position: 'Pharmacist', email: 'sarah.w@hospital.com', contactNumber: '555-3456', isActive: true },
    { _id: '5', firstName: 'Robert', lastName: 'Brown', department: 'Radiology', position: 'Radiologist', email: 'robert.b@hospital.com', contactNumber: '555-7890', isActive: false }
  ],
  attendance: [
    { _id: '1', staffId: { _id: '1', firstName: 'John', lastName: 'Doe', department: 'Nursing', position: 'Head Nurse' }, date: new Date(), status: 'Present', clockIn: new Date(new Date().setHours(8, 0)), clockOut: new Date(new Date().setHours(16, 0)), shift: 'Morning' },
    { _id: '2', staffId: { _id: '2', firstName: 'Jane', lastName: 'Smith', department: 'Administration', position: 'Admin Assistant' }, date: new Date(), status: 'Present', clockIn: new Date(new Date().setHours(9, 0)), clockOut: new Date(new Date().setHours(17, 0)), shift: 'Morning' },
    { _id: '3', staffId: { _id: '3', firstName: 'Michael', lastName: 'Johnson', department: 'Laboratory', position: 'Lab Technician' }, date: new Date(), status: 'Late', clockIn: new Date(new Date().setHours(9, 30)), clockOut: null, shift: 'Morning' },
    { _id: '4', staffId: { _id: '4', firstName: 'Sarah', lastName: 'Williams', department: 'Pharmacy', position: 'Pharmacist' }, date: new Date(), status: 'Absent', clockIn: null, clockOut: null, shift: 'Morning' },
    { _id: '5', staffId: { _id: '5', firstName: 'Robert', lastName: 'Brown', department: 'Radiology', position: 'Radiologist' }, date: new Date(new Date().setDate(new Date().getDate() - 1)), status: 'Present', clockIn: new Date(new Date().setDate(new Date().getDate() - 1)).setHours(8, 0), clockOut: new Date(new Date().setDate(new Date().getDate() - 1)).setHours(16, 0), shift: 'Morning' }
  ],
  departments: [
    { _id: '1', name: 'Nursing', description: 'Nursing department', headOfDepartment: { _id: '1', firstName: 'John', lastName: 'Doe', position: 'Head Nurse' }, location: 'Floor 2', staffRequirement: 20, currentStaffCount: 15, currentWorkload: 'High', understaffing: 5 },
    { _id: '2', name: 'Administration', description: 'Administration department', headOfDepartment: { _id: '2', firstName: 'Jane', lastName: 'Smith', position: 'Admin Manager' }, location: 'Floor 1', staffRequirement: 10, currentStaffCount: 10, currentWorkload: 'Medium', understaffing: 0 },
    { _id: '3', name: 'Laboratory', description: 'Laboratory department', headOfDepartment: { _id: '3', firstName: 'Michael', lastName: 'Johnson', position: 'Lab Director' }, location: 'Floor 3', staffRequirement: 15, currentStaffCount: 12, currentWorkload: 'Medium', understaffing: 3 },
    { _id: '4', name: 'Pharmacy', description: 'Pharmacy department', headOfDepartment: { _id: '4', firstName: 'Sarah', lastName: 'Williams', position: 'Chief Pharmacist' }, location: 'Floor 1', staffRequirement: 8, currentStaffCount: 5, currentWorkload: 'Critical', understaffing: 3 },
    { _id: '5', name: 'Radiology', description: 'Radiology department', headOfDepartment: { _id: '5', firstName: 'Robert', lastName: 'Brown', position: 'Head Radiologist' }, location: 'Floor 3', staffRequirement: 12, currentStaffCount: 10, currentWorkload: 'Low', understaffing: 2 }
  ],
  notifications: [
    { _id: '1', staffId: { _id: '1', firstName: 'John', lastName: 'Doe' }, department: 'Nursing', startTime: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(8, 0), endTime: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(16, 0), type: 'Regular', status: 'Scheduled', notes: 'Regular shift' },
    { _id: '2', staffId: { _id: '2', firstName: 'Jane', lastName: 'Smith' }, department: 'Administration', startTime: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(9, 0), endTime: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(17, 0), type: 'Regular', status: 'Scheduled', notes: 'Regular shift' },
    { _id: '3', staffId: { _id: '3', firstName: 'Michael', lastName: 'Johnson' }, department: 'Laboratory', startTime: new Date(new Date().setDate(new Date().getDate() + 2)).setHours(8, 0), endTime: new Date(new Date().setDate(new Date().getDate() + 2)).setHours(16, 0), type: 'Overtime', status: 'Scheduled', notes: 'Overtime shift' },
    { _id: '4', staffId: { _id: '4', firstName: 'Sarah', lastName: 'Williams' }, department: 'Pharmacy', startTime: new Date(new Date().setDate(new Date().getDate() + 3)).setHours(9, 0), endTime: new Date(new Date().setDate(new Date().getDate() + 3)).setHours(17, 0), type: 'Weekend', status: 'Scheduled', notes: 'Weekend shift' },
    { _id: '5', staffId: { _id: '5', firstName: 'Robert', lastName: 'Brown' }, department: 'Radiology', startTime: new Date(new Date().setDate(new Date().getDate() + 4)).setHours(8, 0), endTime: new Date(new Date().setDate(new Date().getDate() + 4)).setHours(16, 0), type: 'Holiday', status: 'Scheduled', notes: 'Holiday shift' }
  ]
};

function StaffDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [staffData, setStaffData] = useState({
    roster: [],
    attendance: [],
    departments: [],
    notifications: []
  });

  useEffect(() => {
    const fetchStaffDashboardData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch data from API
        let rosterData = [];
        let attendanceData = [];
        let departmentsData = [];
        let notificationsData = [];
        
        try {
          // Get staff roster
          const rosterResponse = await axios.get('/api/staff');
          rosterData = rosterResponse.data.data || [];
        } catch (err) {
          console.warn('Failed to fetch roster data, using mock data', err);
          rosterData = MOCK_DATA.roster;
        }
        
        try {
          // Get staff attendance
          const today = new Date();
          const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          
          const attendanceResponse = await axios.get('/api/attendance', {
            params: {
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString()
            }
          });
          attendanceData = attendanceResponse.data.data || [];
        } catch (err) {
          console.warn('Failed to fetch attendance data, using mock data', err);
          attendanceData = MOCK_DATA.attendance;
        }
        
        try {
          // Get department overview
          const departmentsResponse = await axios.get('/api/departments/overview');
          departmentsData = departmentsResponse.data.data || [];
        } catch (err) {
          console.warn('Failed to fetch departments data, using mock data', err);
          departmentsData = MOCK_DATA.departments;
        }
        
        try {
          // Get notifications (shifts, approvals, etc)
          const today = new Date();
          const notificationsResponse = await axios.get('/api/shifts', {
            params: {
              startDate: today.toISOString(),
              endDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString() // Next 7 days
            }
          });
          notificationsData = notificationsResponse.data.data || [];
        } catch (err) {
          console.warn('Failed to fetch notifications data, using mock data', err);
          notificationsData = MOCK_DATA.notifications;
        }
        
        setStaffData({
          roster: rosterData,
          attendance: attendanceData,
          departments: departmentsData,
          notifications: notificationsData
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching staff dashboard data:', err);
        // Fall back to mock data completely if all else fails
        setStaffData(MOCK_DATA);
        setLoading(false);
      }
    };
    
    fetchStaffDashboardData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Staff Dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Staff Dashboard
      </Typography>
      
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
            aria-label="staff dashboard tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Staff Roster" {...a11yProps(0)} />
            <Tab label="Attendance Tracking" {...a11yProps(1)} />
            <Tab label="Department Overview" {...a11yProps(2)} />
            <Tab label="Notifications" {...a11yProps(3)} />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <StaffRoster staffData={staffData.roster} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <AttendanceTracking attendanceData={staffData.attendance} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <DepartmentOverview departmentData={staffData.departments} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <StaffNotifications notificationData={staffData.notifications} />
        </TabPanel>
      </Paper>
    </Container>
  );
}

export default StaffDashboard; 