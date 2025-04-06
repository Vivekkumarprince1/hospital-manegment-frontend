import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Button, 
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
  IconButton,
  Chip,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { 
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import * as appointmentService from '../services/appointmentService';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, [page, rowsPerPage, searchQuery, statusFilter, dateFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      const filters = {
        search: searchQuery,
        status: statusFilter
      };
      
      if (dateFilter) {
        filters.date = dateFilter.format('YYYY-MM-DD');
      }
      
      const response = await appointmentService.getAllAppointments(page + 1, rowsPerPage, filters);
      setAppointments(response.appointments || []);
      setTotalAppointments(response.totalAppointments || 0);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
      setTotalAppointments(0);
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

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };

  const handleDateChange = (value) => {
    setDateFilter(value);
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'primary';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  // Helper function to get the correct ID
  const getAppointmentId = (appointment) => {
    return appointment._id || appointment.id;
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Appointments
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/appointments/new"
        >
          New Appointment
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              fullWidth
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                endAdornment: <SearchIcon color="action" />
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="Status"
                onChange={handleStatusChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4} md={3}>
            <DatePicker
              label="Date"
              value={dateFilter}
              onChange={handleDateChange}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4} md={3}>
            <Box display="flex" justifyContent="flex-end">
              <Button 
                variant="outlined" 
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('');
                  setDateFilter(null);
                }}
              >
                Clear Filters
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Patient</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <Link to={`/patients/${appointment.patientId}`} style={{ color: '#1976d2', textDecoration: 'none' }}>
                          {appointment.patientName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link to={`/doctors/${appointment.doctorId}`} style={{ color: '#1976d2', textDecoration: 'none' }}>
                          {appointment.doctorName}
                        </Link>
                      </TableCell>
                      <TableCell>{formatDate(appointment.date)}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{appointment.type}</TableCell>
                      <TableCell>
                        <Chip 
                          label={appointment.status} 
                          color={getStatusColor(appointment.status)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          component={Link} 
                          to={`/appointments/${getAppointmentId(appointment)}`}
                          size="small"
                        >
                          <EventIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          component={Link} 
                          to={`/appointments/${getAppointmentId(appointment)}/edit`}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small"
                          color="error"
                          onClick={() => {
                            if(window.confirm('Are you sure you want to delete this appointment?')) {
                              setLoading(true);
                              const appointmentId = getAppointmentId(appointment);
                              console.log('Deleting appointment with ID:', appointmentId);
                              appointmentService.deleteAppointment(appointmentId)
                                .then((response) => {
                                  console.log('Delete response:', response);
                                  alert('Appointment deleted successfully');
                                  fetchAppointments(); // Refresh the list
                                })
                                .catch(err => {
                                  console.error("Error deleting appointment:", err);
                                  alert(`Failed to delete appointment: ${err.message}`);
                                })
                                .finally(() => {
                                  setLoading(false);
                                });
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">No appointments found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalAppointments}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Box>
  );
};

export default AppointmentsList; 
 