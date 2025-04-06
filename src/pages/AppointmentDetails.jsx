import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  MenuItem,
  Card,
  CardContent
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  Schedule as TimeIcon,
  MedicalServices as MedicalIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import * as appointmentService from '../services/appointmentService';

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [statusValue, setStatusValue] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchAppointmentDetails();
  }, [id]);

  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAppointmentById(id);
      setAppointment(response);
      setStatusValue(response.status);
      setNotes(response.notes || '');
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      setAppointment(null);
      setStatusValue('');
      setNotes('');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await appointmentService.deleteAppointment(id);
      navigate('/appointments');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      // For development, just navigate back to the list
      navigate('/appointments');
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await appointmentService.updateAppointmentStatus(id, statusValue);
      setAppointment({ ...appointment, status: statusValue });
      setOpenStatusDialog(false);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      // For development, just update the local state
      setAppointment({ ...appointment, status: statusValue });
      setOpenStatusDialog(false);
    }
  };

  const handleNotesUpdate = async () => {
    try {
      await appointmentService.updateAppointment(id, { notes });
      setAppointment({ ...appointment, notes });
    } catch (error) {
      console.error('Error updating appointment notes:', error);
      // For development, just update the local state
      setAppointment({ ...appointment, notes });
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenStatusDialog = () => {
    setOpenStatusDialog(true);
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
    setStatusValue(appointment.status);
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

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  if (loading || !appointment) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            component={Link}
            to="/appointments"
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Appointment Details
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            component={Link}
            to={`/appointments/${id}/edit`}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleOpenDialog}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Appointment Information
              </Typography>
              <Chip 
                label={appointment.status} 
                color={getStatusColor(appointment.status)} 
                onClick={handleOpenStatusDialog}
              />
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" color="text.secondary">
                      Patient
                    </Typography>
                    <Typography variant="body1">
                      <Link 
                        to={`/patients/${appointment.patientId}`} 
                        style={{ color: '#1976d2', textDecoration: 'none' }}
                      >
                        {appointment.patientName}
                      </Link>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" color="text.secondary">
                      Doctor
                    </Typography>
                    <Typography variant="body1">
                      <Link 
                        to={`/doctors/${appointment.doctorId}`} 
                        style={{ color: '#1976d2', textDecoration: 'none' }}
                      >
                        {appointment.doctorName}
                      </Link>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="subtitle1" color="text.secondary">
                        Date
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(appointment.date)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimeIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="subtitle1" color="text.secondary">
                        Time
                      </Typography>
                      <Typography variant="body1">
                        {appointment.time}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <MedicalIcon color="primary" sx={{ mr: 1 }} />
                    <Box>
                      <Typography variant="subtitle1" color="text.secondary">
                        Appointment Type
                      </Typography>
                      <Typography variant="body1">
                        {appointment.type}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" color="text.secondary">
                      Reason for Visit
                    </Typography>
                    <Typography variant="body1">
                      {appointment.reason || 'No reason specified'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Notes
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<SaveIcon />}
                onClick={handleNotesUpdate}
              >
                Save Notes
              </Button>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Add notes about the appointment here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Timeline
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Appointment Created" 
                  secondary={formatDateTime(appointment.createdAt)} 
                />
              </ListItem>
              {appointment.updatedAt && (
                <ListItem>
                  <ListItemText 
                    primary="Last Updated" 
                    secondary={formatDateTime(appointment.updatedAt)} 
                  />
                </ListItem>
              )}
              {appointment.status === 'Completed' && (
                <ListItem>
                  <ListItemText 
                    primary="Completed" 
                    secondary={formatDateTime(appointment.completedAt)} 
                  />
                </ListItem>
              )}
              {appointment.status === 'Cancelled' && (
                <ListItem>
                  <ListItemText 
                    primary="Cancelled" 
                    secondary={formatDateTime(appointment.cancelledAt)} 
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Delete Appointment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this appointment? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
      >
        <DialogTitle>Update Appointment Status</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Change the status of this appointment.
          </DialogContentText>
          <TextField
            select
            fullWidth
            label="Status"
            value={statusValue}
            onChange={(e) => setStatusValue(e.target.value)}
          >
            <MenuItem value="Scheduled">Scheduled</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>Cancel</Button>
          <Button onClick={handleStatusUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentDetails; 
 