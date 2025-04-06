import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Divider,
  Chip,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
  MeetingRoom as MeetingRoomIcon
} from '@mui/icons-material';
import * as admissionService from '../services/admissionService';

const AdmissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [admission, setAdmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDischargeDialog, setOpenDischargeDialog] = useState(false);
  const [dischargeData, setDischargeData] = useState({
    dischargeDate: new Date().toISOString().split('T')[0],
    dischargeNotes: '',
    dischargeSummary: ''
  });
  const [dischargeLoading, setDischargeLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchAdmissionData = async () => {
      try {
        setLoading(true);
        const response = await admissionService.getAdmissionById(id);
        setAdmission(response.admission);
      } catch (error) {
        console.error('Error fetching admission details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAdmissionData();
    }
  }, [id]);

  const handleOpenDischargeDialog = () => {
    setOpenDischargeDialog(true);
  };

  const handleCloseDischargeDialog = () => {
    setOpenDischargeDialog(false);
  };

  const handleDischargeFormChange = (e) => {
    const { name, value } = e.target;
    setDischargeData({
      ...dischargeData,
      [name]: value
    });
  };

  const handleDischargeSubmit = async (e) => {
    e.preventDefault();
    try {
      setDischargeLoading(true);
      const response = await admissionService.dischargePatient(id, dischargeData);
      setAdmission(response.admission);
      setOpenDischargeDialog(false);
      // Show success message (could use a snackbar in a real app)
      alert('Patient discharged successfully');
    } catch (error) {
      console.error('Error discharging patient:', error);
      alert(`Failed to discharge patient: ${error.message}`);
    } finally {
      setDischargeLoading(false);
    }
  };

  const handleOpenDeleteConfirmation = () => {
    setConfirmDelete(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setConfirmDelete(false);
  };

  const handleDeleteAdmission = async () => {
    try {
      await admissionService.deleteAdmission(id);
      navigate('/admissions');
      // Show success message (could use a snackbar in a real app)
      alert('Admission record deleted successfully');
    } catch (error) {
      console.error('Error deleting admission:', error);
      alert(`Failed to delete admission: ${error.message}`);
    } finally {
      setConfirmDelete(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!admission) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h5">Admission record not found</Typography>
        <Button component={Link} to="/admissions" variant="contained" sx={{ mt: 2 }}>
          Back to Admissions List
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton component={Link} to="/admissions" sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
          Admission Details
        </Typography>
        <Box>
          {admission.status === 'Active' && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckCircleIcon />}
              onClick={handleOpenDischargeDialog}
              sx={{ mr: 1 }}
            >
              Discharge Patient
            </Button>
          )}
          <Button
            component={Link}
            to={`/admissions/${id}/edit`}
            variant="outlined"
            startIcon={<EditIcon />}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleOpenDeleteConfirmation}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MeetingRoomIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" component="h2">
                  Room {admission.roomNumber} - {admission.wardType} Ward
                </Typography>
                <Chip
                  label={admission.status}
                  color={getStatusColor(admission.status)}
                  size="small"
                  sx={{ ml: 2 }}
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <List disablePadding>
                    <ListItem disablePadding>
                      <ListItemText 
                        primary="Patient"
                        secondary={admission.patientName || admission.patientId?.name || 'Unknown'}
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText 
                        primary="Doctor"
                        secondary={admission.doctorName || admission.doctorId?.name || 'Unknown'}
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText 
                        primary="Admission Date"
                        secondary={formatDate(admission.admissionDate)}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <List disablePadding>
                    <ListItem disablePadding>
                      <ListItemText 
                        primary="Discharge Date"
                        secondary={formatDate(admission.dischargeDate) || 'Not discharged'}
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText 
                        primary="Duration"
                        secondary={
                          admission.dischargeDate 
                            ? `${Math.ceil((new Date(admission.dischargeDate) - new Date(admission.admissionDate)) / (1000 * 60 * 60 * 24))} days` 
                            : 'Ongoing'
                        }
                      />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText 
                        primary="Created On"
                        secondary={formatDate(admission.createdAt)}
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Reason for Admission
              </Typography>
              <Typography paragraph>
                {admission.reasonForAdmission}
              </Typography>
              
              {admission.diagnosis && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Diagnosis
                  </Typography>
                  <Typography paragraph>
                    {admission.diagnosis}
                  </Typography>
                </>
              )}
              
              {admission.treatmentPlan && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Treatment Plan
                  </Typography>
                  <Typography paragraph>
                    {admission.treatmentPlan}
                  </Typography>
                </>
              )}
              
              {admission.notes && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Notes
                  </Typography>
                  <Typography paragraph>
                    {admission.notes}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
          
          {admission.status === 'Discharged' && (
            <Card elevation={3} sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Discharge Information
                </Typography>
                <Divider sx={{ my: 1 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  Discharge Date: {formatDate(admission.dischargeDate)}
                </Typography>
                
                {admission.dischargeNotes && (
                  <>
                    <Typography variant="subtitle1" gutterBottom>
                      Discharge Notes:
                    </Typography>
                    <Typography paragraph>
                      {admission.dischargeNotes}
                    </Typography>
                  </>
                )}
                
                {admission.dischargeSummary && (
                  <>
                    <Typography variant="subtitle1" gutterBottom>
                      Discharge Summary:
                    </Typography>
                    <Typography paragraph>
                      {admission.dischargeSummary}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Button
              component={Link}
              to={`/patients/${admission.patientId}`}
              variant="outlined"
              fullWidth
              sx={{ mb: 1 }}
            >
              View Patient Profile
            </Button>
            <Button
              component={Link}
              to={`/appointments/new?patientId=${admission.patientId}`}
              variant="outlined"
              fullWidth
              sx={{ mb: 1 }}
            >
              Schedule Follow-up
            </Button>
            {admission.status === 'Active' && (
              <Button
                onClick={handleOpenDischargeDialog}
                variant="contained"
                color="primary"
                fullWidth
              >
                Discharge Patient
              </Button>
            )}
          </Paper>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Related Records</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                No related records found.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
      
      {/* Discharge Dialog */}
      <Dialog open={openDischargeDialog} onClose={handleCloseDischargeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Discharge Patient</DialogTitle>
        <form onSubmit={handleDischargeSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Discharge Date"
                  name="dischargeDate"
                  type="date"
                  value={dischargeData.dischargeDate}
                  onChange={handleDischargeFormChange}
                  fullWidth
                  required
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Discharge Notes"
                  name="dischargeNotes"
                  value={dischargeData.dischargeNotes}
                  onChange={handleDischargeFormChange}
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Discharge Summary"
                  name="dischargeSummary"
                  value={dischargeData.dischargeSummary}
                  onChange={handleDischargeFormChange}
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDischargeDialog}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={dischargeLoading}
            >
              {dischargeLoading ? 'Processing...' : 'Discharge Patient'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onClose={handleCloseDeleteConfirmation}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this admission record? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmation}>Cancel</Button>
          <Button 
            onClick={handleDeleteAdmission} 
            variant="contained" 
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdmissionDetails; 