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
  Card,
  CardHeader,
  CardContent,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AccessibilityNew as GenderIcon,
  Bloodtype as BloodGroupIcon,
  CalendarToday as CalendarIcon,
  Home as AddressIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import * as patientService from '../services/patientService';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchPatientDetails();
  }, [id]);

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      const response = await patientService.getPatientById(id);
      setPatient(response);
    } catch (error) {
      console.error('Error fetching patient details:', error);
      setPatient(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await patientService.deletePatient(id);
      navigate('/patients');
    } catch (error) {
      console.error('Error deleting patient:', error);
      // For development, just navigate back to the list
      navigate('/patients');
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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

  if (loading || !patient) {
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
            to="/patients"
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Patient Details
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/patients/${id}/dashboard`}
            startIcon={<DashboardIcon />}
            sx={{ mr: 1 }}
          >
            View Dashboard
          </Button>
          <Button
            variant="outlined"
            component={Link}
            to={`/appointments/new?patientId=${id}`}
            startIcon={<AddIcon />}
            sx={{ mr: 1 }}
          >
            New Appointment
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            component={Link}
            to={`/patients/${id}/edit`}
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
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}
              >
                <PersonIcon sx={{ fontSize: 50 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                {patient.name}
              </Typography>
              <Chip
                label={patient.status}
                color={patient.status === 'Active' ? 'success' : 'error'}
                sx={{ mt: 1 }}
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Personal Information
            </Typography>
            
            <List>
              <ListItem>
                <EmailIcon color="primary" sx={{ mr: 2 }} />
                <ListItemText primary="Email" secondary={patient.email} />
              </ListItem>
              <ListItem>
                <PhoneIcon color="primary" sx={{ mr: 2 }} />
                <ListItemText primary="Phone" secondary={patient.phone} />
              </ListItem>
              <ListItem>
                <GenderIcon color="primary" sx={{ mr: 2 }} />
                <ListItemText primary="Gender" secondary={patient.gender} />
              </ListItem>
              <ListItem>
                <CalendarIcon color="primary" sx={{ mr: 2 }} />
                <ListItemText 
                  primary="Date of Birth" 
                  secondary={`${formatDate(patient.dateOfBirth)} (${patient.age} years)`} 
                />
              </ListItem>
              <ListItem>
                <BloodGroupIcon color="primary" sx={{ mr: 2 }} />
                <ListItemText primary="Blood Group" secondary={patient.bloodGroup} />
              </ListItem>
              <ListItem>
                <AddressIcon color="primary" sx={{ mr: 2 }} />
                <ListItemText primary="Address" secondary={patient.address} />
              </ListItem>
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Emergency Contact
            </Typography>
            
            <List>
              <ListItem>
                <ListItemText 
                  primary={patient.emergencyContact.name} 
                  secondary={`${patient.emergencyContact.relationship} • ${patient.emergencyContact.phone}`} 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Medical History
            </Typography>
            
            {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
              <Grid container spacing={2}>
                {patient.medicalHistory.map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card variant="outlined">
                      <CardHeader
                        title={item.condition}
                        subheader={`Diagnosed: ${formatDate(item.diagnosedDate)}`}
                      />
                      <CardContent sx={{ pt: 0 }}>
                        <Typography variant="body2" color="text.secondary">
                          {item.notes}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No medical history recorded.
              </Typography>
            )}
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Appointments
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                component={Link}
                to={`/appointments/new?patientId=${id}`}
                size="small"
              >
                New Appointment
              </Button>
            </Box>
            
            {patient.appointments && patient.appointments.length > 0 ? (
              <Grid container spacing={2}>
                {patient.appointments.map((appointment) => (
                  <Grid item xs={12} key={appointment._id}>
                    <Card variant="outlined">
                      <CardHeader
                        title={`Appointment with ${appointment.doctor}`}
                        subheader={`${formatDate(appointment.date)} at ${appointment.time}`}
                        action={
                          <Chip 
                            label={appointment.status} 
                            color={appointment.status === 'Completed' ? 'success' : 'primary'} 
                            size="small" 
                          />
                        }
                      />
                      <CardContent sx={{ pt: 0 }}>
                        <Typography variant="body2" color="text.secondary">
                          {appointment.notes}
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                          <Button 
                            component={Link} 
                            to={`/appointments/${appointment._id}`}
                            size="small"
                          >
                            View Details
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No appointments scheduled.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Delete Patient</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {patient.name}'s records? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientDetails; 
 