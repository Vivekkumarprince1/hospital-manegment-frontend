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
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import * as patientService from '../services/patientService';

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPatients, setTotalPatients] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPatients();
  }, [page, rowsPerPage, searchQuery]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await patientService.getAllPatients(page + 1, rowsPerPage, searchQuery);
      setPatients(response.patients || []);
      setTotalPatients(response.totalPatients || 0);
    } catch (error) {
      console.error('Error fetching patients:', error);
      // Set mock data for development
      setPatients([]);
      setTotalPatients(0);
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

  const getStatusColor = (status) => {
    return status === 'Active' ? 'success' : 'error';
  };

  // Helper function to get the correct ID
  const getPatientId = (patient) => {
    return patient._id || patient.id;
  };

  // Handle deleting a patient
  const handleDeletePatient = async (patientId) => {
    if(window.confirm('Are you sure you want to delete this patient?')) {
      try {
        setLoading(true);
        console.log('Deleting patient with ID:', patientId);
        await patientService.deletePatient(patientId);
        alert('Patient deleted successfully');
        fetchPatients(); // Refresh the list
      } catch (error) {
        console.error("Error deleting patient:", error);
        alert(`Failed to delete patient: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Patients
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/patients/new"
        >
          Add Patient
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Search patients"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearch}
          sx={{ width: 300 }}
          InputProps={{
            endAdornment: <SearchIcon color="action" />
          }}
        />
      </Box>

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
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Blood Group</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.length > 0 ? (
                  patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell component="th" scope="row">
                        <Link to={`/patients/${getPatientId(patient)}`} style={{ color: '#1976d2', textDecoration: 'none' }}>
                          {patient.name}
                        </Link>
                      </TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.bloodGroup}</TableCell>
                      <TableCell>
                        <Chip 
                          label={patient.status || 'Active'} 
                          color={getStatusColor(patient.status)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Dashboard">
                          <IconButton 
                            component={Link} 
                            to={`/patients/${getPatientId(patient)}/dashboard`}
                            size="small"
                            color="primary"
                          >
                            <DashboardIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton 
                            component={Link} 
                            to={`/patients/${getPatientId(patient)}/edit`}
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small"
                            color="error"
                            onClick={() => handleDeletePatient(getPatientId(patient))}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">No patients found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalPatients}
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

export default PatientsList; 
 