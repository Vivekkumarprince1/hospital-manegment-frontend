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
  DialogTitle
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  MedicalServices as SpecialtyIcon
} from '@mui/icons-material';
import * as doctorService from '../services/doctorService';

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchDoctorDetails();
  }, [id]);

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      const response = await doctorService.getDoctorById(id);
      setDoctor(response);
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      setDoctor(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await doctorService.deleteDoctor(id);
      navigate('/doctors');
    } catch (error) {
      console.error('Error deleting doctor:', error);
      // For development, just navigate back to the list
      navigate('/doctors');
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (loading) {
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
            to="/doctors"
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Doctor Details
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<EditIcon />}
            component={Link}
            to={`/doctors/${id}/edit`}
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

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}
              >
                <PersonIcon sx={{ fontSize: 60 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                {doctor.name}
              </Typography>
              <Chip
                label={doctor.specialization || 'Not specified'}
                color="primary"
                icon={<SpecialtyIcon color="primary" sx={{ mr: 2 }} />}
                sx={{ mt: 1 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Contact Information
            </Typography>
            <List>
              <ListItem>
                <EmailIcon color="primary" sx={{ mr: 2 }} />
                <ListItemText primary="Email" secondary={doctor.email} />
              </ListItem>
              <ListItem>
                <PhoneIcon color="primary" sx={{ mr: 2 }} />
                <ListItemText primary="Phone" secondary={doctor.phone} />
              </ListItem>
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Professional Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">
                  Qualifications
                </Typography>
                <Typography variant="body1">{doctor.qualifications}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">
                  Experience
                </Typography>
                <Typography variant="body1">{doctor.experience}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">
                  Consultation Fee
                </Typography>
                <Typography variant="body1">${doctor.consultationFee}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" color="text.secondary">
                  Working Hours
                </Typography>
                <Typography variant="body1">{doctor.workingHours}</Typography>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Bio
            </Typography>
            <Typography variant="body1">{doctor.bio}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Delete Doctor</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {doctor.name}? This action cannot be undone.
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

export default DoctorDetails; 
 