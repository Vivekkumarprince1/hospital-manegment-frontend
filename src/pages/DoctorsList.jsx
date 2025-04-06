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
  IconButton
} from '@mui/material';
import { 
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import * as doctorService from '../services/doctorService';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, [page, rowsPerPage, searchQuery]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorService.getAllDoctors(page + 1, rowsPerPage, searchQuery);
      setDoctors(response.doctors || []);
      setTotalDoctors(response.totalDoctors || 0);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
      setTotalDoctors(0);
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

  const handleDeleteDoctor = async (doctorId) => {
    if(window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        setLoading(true);
        console.log('Deleting doctor with ID:', doctorId);
        await doctorService.deleteDoctor(doctorId);
        alert('Doctor deleted successfully');
        fetchDoctors(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting doctor:', error);
        alert(`Failed to delete doctor: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Helper function to get the correct ID
  const getDoctorId = (doctor) => {
    return doctor._id || doctor.id;
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Doctors
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/doctors/new"
        >
          Add Doctor
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Search doctors"
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
                  <TableCell>Specialty</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {doctors.length > 0 ? (
                  doctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell component="th" scope="row">
                        <Link to={`/doctors/${getDoctorId(doctor)}`} style={{ color: '#1976d2', textDecoration: 'none' }}>
                          {doctor.name}
                        </Link>
                      </TableCell>
                      <TableCell>{doctor.specialization}</TableCell>
                      <TableCell>{doctor.email}</TableCell>
                      <TableCell>{doctor.phone}</TableCell>
                      <TableCell>
                        <IconButton 
                          component={Link} 
                          to={`/doctors/${getDoctorId(doctor)}/edit`}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small"
                          color="error"
                          onClick={() => handleDeleteDoctor(getDoctorId(doctor))}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No doctors found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalDoctors}
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

export default DoctorsList; 