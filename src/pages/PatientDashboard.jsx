import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Button, 
  Chip, 
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Badge,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { 
  Person as PersonIcon,
  Event as EventIcon,
  Healing as HealingIcon,
  LocalHospital as LocalHospitalIcon,
  Assignment as AssignmentIcon,
  NoteAdd as NoteAddIcon,
  Hotel as HotelIcon,
  MeetingRoom as MeetingRoomIcon
} from '@mui/icons-material';
import * as patientService from '../services/patientService';
import * as appointmentService from '../services/appointmentService';
import * as admissionService from '../services/admissionService';
import * as doctorService from '../services/doctorService';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`patient-tabpanel-${index}`}
      aria-labelledby={`patient-tab-${index}`}
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

const PatientDashboard = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  
  // States for admission modal
  const [openAdmissionModal, setOpenAdmissionModal] = useState(false);
  const [admissionFormData, setAdmissionFormData] = useState({
    patientId: '',
    doctorId: '',
    roomNumber: '',
    wardType: 'General',
    reasonForAdmission: '',
    notes: ''
  });
  const [doctors, setDoctors] = useState([]);
  const [admissionLoading, setAdmissionLoading] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const { patient } = await patientService.getPatientById(id);
        setPatient(patient);

        // Fetch appointments for this patient
        const response = await appointmentService.getAppointmentsByPatient(id);
        const allAppointments = response.appointments || [];
        setAppointments(allAppointments);

        // Separate past and upcoming appointments
        const today = new Date().toISOString().split('T')[0];
        
        const upcoming = allAppointments.filter(appointment => 
          appointment.date >= today && 
          appointment.status !== 'Cancelled' &&
          appointment.status !== 'Completed'
        );
        
        const past = allAppointments.filter(appointment => 
          appointment.date < today || 
          appointment.status === 'Cancelled' ||
          appointment.status === 'Completed'
        );
        
        setUpcomingAppointments(upcoming);
        setPastAppointments(past);
        
        // Fetch admission records
        const admissionResponse = await admissionService.getPatientAdmissions(id);
        setAdmissions(admissionResponse.admissions || []);
        
        // Fetch doctors list for admission form
        const doctorsResponse = await doctorService.getAllDoctors(1, 100);
        setDoctors(doctorsResponse.doctors || []);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPatientData();
    }
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'primary';
      case 'Confirmed':
        return 'info';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'error';
      case 'Active':
        return 'success';
      case 'Discharged':
        return 'default';
      case 'Transferred':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  const handleOpenAdmissionModal = () => {
    setAdmissionFormData({
      patientId: id,
      doctorId: patient.assignedDoctor || '',
      roomNumber: '',
      wardType: 'General',
      reasonForAdmission: '',
      notes: ''
    });
    setOpenAdmissionModal(true);
  };
  
  const handleCloseAdmissionModal = () => {
    setOpenAdmissionModal(false);
  };
  
  const handleAdmissionFormChange = (e) => {
    const { name, value } = e.target;
    setAdmissionFormData({
      ...admissionFormData,
      [name]: value
    });
  };
  
  const handleSubmitAdmission = async (e) => {
    e.preventDefault();
    try {
      setAdmissionLoading(true);
      const response = await admissionService.createAdmission(admissionFormData);
      
      // Add the new admission to the list
      setAdmissions([response.admission, ...admissions]);
      
      // Close the modal
      setOpenAdmissionModal(false);
      
      // Show success message (could use a snackbar in a real app)
      alert('Patient admitted successfully');
    } catch (error) {
      console.error('Error creating admission:', error);
      alert(`Failed to create admission: ${error.message}`);
    } finally {
      setAdmissionLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!patient) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h5">Patient not found</Typography>
        <Button component={Link} to="/patients" variant="contained" sx={{ mt: 2 }}>
          Back to Patients List
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Patient Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Patient Information Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardHeader 
              title="Patient Information" 
              avatar={<PersonIcon color="primary" />}
            />
            <Divider />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemText primary="Name" secondary={patient.name} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Age" secondary={`${patient.age} years`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Gender" secondary={patient.gender} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Email" secondary={patient.email} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Phone" secondary={patient.phone} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Blood Group" secondary={patient.bloodGroup} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Status" secondary={
                    <Chip 
                      size="small"
                      label={patient.status || 'Active'} 
                      color={patient.status === 'Active' ? 'success' : 'default'} 
                    />
                  } />
                </ListItem>
              </List>
              <Button 
                component={Link} 
                to={`/patients/${id}/edit`}
                variant="outlined" 
                fullWidth
                sx={{ mt: 1 }}
              >
                Edit Information
              </Button>
            </CardContent>
          </Card>
          
          {/* Medical History Card */}
          <Card elevation={3} sx={{ mt: 3 }}>
            <CardHeader 
              title="Medical History" 
              avatar={<HealingIcon color="error" />}
            />
            <Divider />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {patient.medicalHistory || 'No medical history recorded.'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Appointments and Medical Records Tabs */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="patient dashboard tabs"
                variant="fullWidth"
              >
                <Tab icon={<EventIcon />} label="Upcoming Appointments" />
                <Tab icon={<AssignmentIcon />} label="Past Appointments" />
                <Tab icon={<LocalHospitalIcon />} label="Admission Records" />
              </Tabs>
            </Box>

            {/* Upcoming Appointments Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  Upcoming Appointments ({upcomingAppointments.length})
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<NoteAddIcon />}
                  component={Link}
                  to={`/appointments/new?patientId=${id}`}
                >
                  Schedule New
                </Button>
              </Box>
              
              {upcomingAppointments.length > 0 ? (
                <List>
                  {upcomingAppointments.map((appointment) => (
                    <Paper 
                      key={appointment.id || appointment._id} 
                      elevation={1} 
                      sx={{ mb: 2, p: 1 }}
                    >
                      <ListItem 
                        component={Link} 
                        to={`/appointments/${appointment.id || appointment._id}`}
                        sx={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <ListItemIcon>
                          <EventIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`${appointment.date} | ${appointment.startTime} - ${appointment.endTime}`} 
                          secondary={`Doctor: ${appointment.doctorName || 'Not assigned'} | ${appointment.purpose || 'General checkup'}`}
                        />
                        <Chip 
                          label={appointment.status} 
                          color={getStatusColor(appointment.status)}
                          size="small"
                        />
                      </ListItem>
                    </Paper>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No upcoming appointments scheduled.
                </Typography>
              )}
            </TabPanel>

            {/* Past Appointments Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                Past Appointments ({pastAppointments.length})
              </Typography>
              
              {pastAppointments.length > 0 ? (
                <List>
                  {pastAppointments.map((appointment) => (
                    <Paper 
                      key={appointment.id || appointment._id} 
                      elevation={1} 
                      sx={{ mb: 2, p: 1 }}
                    >
                      <ListItem 
                        component={Link} 
                        to={`/appointments/${appointment.id || appointment._id}`}
                        sx={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <ListItemIcon>
                          <EventIcon color={appointment.status === 'Completed' ? 'success' : 'error'} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`${appointment.date} | ${appointment.startTime} - ${appointment.endTime}`} 
                          secondary={`Doctor: ${appointment.doctorName || 'Not assigned'} | ${appointment.purpose || 'General checkup'}`}
                        />
                        <Chip 
                          label={appointment.status} 
                          color={getStatusColor(appointment.status)}
                          size="small"
                        />
                      </ListItem>
                    </Paper>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No past appointments found.
                </Typography>
              )}
            </TabPanel>

            {/* Admission Records Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  Admission Records ({admissions.length})
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<NoteAddIcon />}
                  onClick={handleOpenAdmissionModal}
                >
                  New Admission
                </Button>
              </Box>
              
              {admissions.length > 0 ? (
                <List>
                  {admissions.map((admission) => (
                    <Paper 
                      key={admission.id || admission._id} 
                      elevation={1} 
                      sx={{ mb: 2, p: 1 }}
                    >
                      <ListItem 
                        component={Link} 
                        to={`/admissions/${admission.id || admission._id}`}
                        sx={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <ListItemIcon>
                          <HotelIcon color={admission.status === 'Active' ? 'success' : 'default'} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Box>
                              <Typography component="span" fontWeight="bold">
                                Room {admission.roomNumber} ({admission.wardType})
                              </Typography>
                              <Typography component="span" sx={{ ml: 2 }}>
                                {new Date(admission.admissionDate).toLocaleDateString()}
                                {admission.dischargeDate && ` - ${new Date(admission.dischargeDate).toLocaleDateString()}`}
                              </Typography>
                            </Box>
                          }
                          secondary={`Doctor: ${admission.doctorName || 'Not assigned'} | Reason: ${admission.reasonForAdmission}`}
                        />
                        <Chip 
                          label={admission.status} 
                          color={getStatusColor(admission.status)}
                          size="small"
                        />
                      </ListItem>
                    </Paper>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No admission records found.
                </Typography>
              )}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Admission Form Dialog */}
      <Dialog open={openAdmissionModal} onClose={handleCloseAdmissionModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MeetingRoomIcon sx={{ mr: 1 }} color="primary" />
            New Patient Admission
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmitAdmission}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Patient"
                  value={patient?.name || ''}
                  fullWidth
                  disabled
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="doctor-label">Attending Doctor</InputLabel>
                  <Select
                    labelId="doctor-label"
                    name="doctorId"
                    value={admissionFormData.doctorId}
                    onChange={handleAdmissionFormChange}
                    required
                    label="Attending Doctor"
                  >
                    {doctors.map((doctor) => (
                      <MenuItem key={doctor.id || doctor._id} value={doctor.id || doctor._id}>
                        {doctor.name} ({doctor.specialization})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  label="Room Number"
                  name="roomNumber"
                  value={admissionFormData.roomNumber}
                  onChange={handleAdmissionFormChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="ward-type-label">Ward Type</InputLabel>
                  <Select
                    labelId="ward-type-label"
                    name="wardType"
                    value={admissionFormData.wardType}
                    onChange={handleAdmissionFormChange}
                    required
                    label="Ward Type"
                  >
                    <MenuItem value="General">General</MenuItem>
                    <MenuItem value="Semi-Private">Semi-Private</MenuItem>
                    <MenuItem value="Private">Private</MenuItem>
                    <MenuItem value="ICU">ICU</MenuItem>
                    <MenuItem value="Emergency">Emergency</MenuItem>
                    <MenuItem value="Pediatric">Pediatric</MenuItem>
                    <MenuItem value="Maternity">Maternity</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Reason for Admission"
                  name="reasonForAdmission"
                  value={admissionFormData.reasonForAdmission}
                  onChange={handleAdmissionFormChange}
                  fullWidth
                  required
                  margin="normal"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Notes"
                  name="notes"
                  value={admissionFormData.notes}
                  onChange={handleAdmissionFormChange}
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAdmissionModal}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={admissionLoading}
              startIcon={admissionLoading ? <CircularProgress size={20} /> : null}
            >
              {admissionLoading ? 'Admitting...' : 'Admit Patient'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default PatientDashboard; 