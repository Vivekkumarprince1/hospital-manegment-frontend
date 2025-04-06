import { useState } from 'react';
import { 
  Grid, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, TablePagination,
  Chip, TextField, Box, Button, IconButton, Card, CardContent,
  MenuItem, Select, FormControl, InputLabel, Divider, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert,
  CircularProgress
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import EditIcon from '@mui/icons-material/Edit';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimerOffIcon from '@mui/icons-material/TimerOff';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BarChartIcon from '@mui/icons-material/BarChart';
import axios from 'axios';
import { format, isToday, isTomorrow, addDays } from 'date-fns';

function AttendanceTracking({ attendanceData }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [staffFilter, setStaffFilter] = useState('');
  const [date, setDate] = useState(new Date());
  const [clockInDialog, setClockInDialog] = useState(false);
  const [clockOutDialog, setClockOutDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [viewMode, setViewMode] = useState('day'); // day, month, report

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get unique staff for filtering
  const staffList = attendanceData.length > 0 
    ? [...new Set(attendanceData.map(attendance => 
        attendance.staffId ? 
        `${attendance.staffId.firstName} ${attendance.staffId.lastName}` : 
        'Unknown Staff'))]
    : [];

  // Filter attendance data based on staff filter and date
  const filterAttendanceData = () => {
    return attendanceData.filter(attendance => {
      const staffName = attendance.staffId ? 
        `${attendance.staffId.firstName} ${attendance.staffId.lastName}` : 
        'Unknown Staff';
      
      const staffMatch = !staffFilter || staffName === staffFilter;
      
      let dateMatch = true;
      if (viewMode === 'day') {
        const attendanceDate = new Date(attendance.date);
        dateMatch = attendanceDate.toDateString() === date.toDateString();
      } else if (viewMode === 'month') {
        const attendanceDate = new Date(attendance.date);
        dateMatch = 
          attendanceDate.getMonth() === date.getMonth() && 
          attendanceDate.getFullYear() === date.getFullYear();
      }
      
      return staffMatch && dateMatch;
    });
  };

  const filteredAttendance = filterAttendanceData();

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return 'success';
      case 'Absent':
        return 'error';
      case 'Late':
        return 'warning';
      case 'Half Day':
        return 'info';
      case 'On Leave':
        return 'default';
      default:
        return 'default';
    }
  };

  // Format time from date
  const formatTime = (dateTime) => {
    if (!dateTime) return 'Not Recorded';
    return format(new Date(dateTime), 'h:mm a');
  };

  // Calculate hours worked
  const calculateHoursWorked = (clockIn, clockOut) => {
    if (!clockIn || !clockOut) return 'N/A';
    const timeIn = new Date(clockIn).getTime();
    const timeOut = new Date(clockOut).getTime();
    const diffHours = (timeOut - timeIn) / (1000 * 60 * 60);
    return diffHours.toFixed(2);
  };

  // Handle clock in
  const handleClockIn = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await axios.post('/api/attendance/clock-in', {
        staffId: selectedStaff
      });
      
      setSuccess('Clocked in successfully!');
      setLoading(false);
      setClockInDialog(false);
      
      // Reload data after a brief delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (err) {
      console.error('Error clocking in:', err);
      setError(err.response?.data?.message || 'Failed to clock in. Please try again.');
      setLoading(false);
    }
  };

  // Handle clock out
  const handleClockOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await axios.post('/api/attendance/clock-out', {
        staffId: selectedStaff
      });
      
      setSuccess('Clocked out successfully!');
      setLoading(false);
      setClockOutDialog(false);
      
      // Reload data after a brief delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (err) {
      console.error('Error clocking out:', err);
      setError(err.response?.data?.message || 'Failed to clock out. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ width: '100%', p: 2 }}>
      <Typography variant="h5" gutterBottom component="div" sx={{ mb: 2 }}>
        Attendance Tracking
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="staff-filter-label">Filter by Staff</InputLabel>
            <Select
              labelId="staff-filter-label"
              id="staff-filter"
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              label="Filter by Staff"
            >
              <MenuItem value="">All Staff</MenuItem>
              {staffList.map((staff) => (
                <MenuItem key={staff} value={staff}>
                  {staff}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={viewMode === 'day' ? "Select Day" : "Select Month"}
              value={date}
              onChange={(newDate) => setDate(newDate)}
              views={viewMode === 'day' ? ['day', 'month', 'year'] : ['month', 'year']}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant={viewMode === 'day' ? "contained" : "outlined"}
              onClick={() => setViewMode('day')}
              startIcon={<CalendarTodayIcon />}
            >
              Daily
            </Button>
            <Button 
              variant={viewMode === 'month' ? "contained" : "outlined"}
              onClick={() => setViewMode('month')}
              startIcon={<BarChartIcon />}
            >
              Monthly
            </Button>
          </Box>
        </Grid>
      </Grid>
      
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setClockInDialog(true)}
          startIcon={<AccessTimeIcon />}
        >
          Clock In
        </Button>
        <Button 
          variant="contained" 
          color="secondary"
          onClick={() => setClockOutDialog(true)}
          startIcon={<TimerOffIcon />}
        >
          Clock Out
        </Button>
      </Stack>
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="attendance tracking table">
          <TableHead>
            <TableRow>
              <TableCell>Staff Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Clock In</TableCell>
              <TableCell>Clock Out</TableCell>
              <TableCell>Hours Worked</TableCell>
              <TableCell>Shift</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAttendance
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((attendance) => {
                const staffName = attendance.staffId ? 
                  `${attendance.staffId.firstName} ${attendance.staffId.lastName}` : 
                  'Unknown Staff';
                
                return (
                  <TableRow key={attendance._id} hover>
                    <TableCell component="th" scope="row">
                      {staffName}
                    </TableCell>
                    <TableCell>
                      {format(new Date(attendance.date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={attendance.status} 
                        color={getStatusColor(attendance.status)} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {formatTime(attendance.clockIn)}
                    </TableCell>
                    <TableCell>
                      {formatTime(attendance.clockOut)}
                    </TableCell>
                    <TableCell>
                      {calculateHoursWorked(attendance.clockIn, attendance.clockOut)} hours
                    </TableCell>
                    <TableCell>
                      {attendance.shift}
                    </TableCell>
                  </TableRow>
                );
              })}
            {filteredAttendance.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No attendance records found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredAttendance.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      
      {/* Clock In Dialog */}
      <Dialog open={clockInDialog} onClose={() => setClockInDialog(false)}>
        <DialogTitle>Clock In</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 400, pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="staff-select-label">Select Staff</InputLabel>
              <Select
                labelId="staff-select-label"
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                label="Select Staff"
              >
                {attendanceData
                  .filter(a => a.staffId)
                  .map(attendance => attendance.staffId)
                  .filter((staffId, index, self) => 
                    index === self.findIndex(s => s._id === staffId._id)
                  )
                  .map(staff => (
                    <MenuItem key={staff._id} value={staff._id}>
                      {staff.firstName} {staff.lastName}
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClockInDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleClockIn} 
            variant="contained" 
            color="primary"
            disabled={!selectedStaff || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Clock In'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Clock Out Dialog */}
      <Dialog open={clockOutDialog} onClose={() => setClockOutDialog(false)}>
        <DialogTitle>Clock Out</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 400, pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="staff-select-out-label">Select Staff</InputLabel>
              <Select
                labelId="staff-select-out-label"
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                label="Select Staff"
              >
                {attendanceData
                  .filter(a => a.staffId && a.clockIn && !a.clockOut)
                  .map(attendance => attendance.staffId)
                  .filter((staffId, index, self) => 
                    index === self.findIndex(s => s._id === staffId._id)
                  )
                  .map(staff => (
                    <MenuItem key={staff._id} value={staff._id}>
                      {staff.firstName} {staff.lastName}
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClockOutDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleClockOut} 
            variant="contained" 
            color="secondary"
            disabled={!selectedStaff || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Clock Out'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default AttendanceTracking; 