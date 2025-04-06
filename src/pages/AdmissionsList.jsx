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
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import * as admissionService from '../services/admissionService';

const AdmissionsList = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalAdmissions, setTotalAdmissions] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchAdmissions();
  }, [page, rowsPerPage, searchQuery, statusFilter]);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const filter = { search: searchQuery };
      if (statusFilter) filter.status = statusFilter;
      
      const response = await admissionService.getAllAdmissions(page + 1, rowsPerPage, filter);
      setAdmissions(response.admissions || []);
      setTotalAdmissions(response.totalAdmissions || 0);
    } catch (error) {
      console.error('Error fetching admissions:', error);
      setAdmissions([]);
      setTotalAdmissions(0);
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

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0);
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

  // Helper function to get the correct ID
  const getAdmissionId = (admission) => {
    return admission._id || admission.id;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Handle deleting an admission
  const handleDeleteAdmission = async (admissionId) => {
    if (window.confirm('Are you sure you want to delete this admission record?')) {
      try {
        setLoading(true);
        console.log('Deleting admission with ID:', admissionId);
        await admissionService.deleteAdmission(admissionId);
        alert('Admission record deleted successfully');
        fetchAdmissions(); // Refresh the list
      } catch (error) {
        console.error('Error deleting admission:', error);
        alert(`Failed to delete admission: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Patient Admissions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/patients"
        >
          New Admission
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          label="Search admissions"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearch}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        
        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label="Status"
            startAdornment={
              <InputAdornment position="start">
                <FilterIcon fontSize="small" />
              </InputAdornment>
            }
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Discharged">Discharged</MenuItem>
            <MenuItem value="Transferred">Transferred</MenuItem>
          </Select>
        </FormControl>
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
                  <TableCell>Patient</TableCell>
                  <TableCell>Room</TableCell>
                  <TableCell>Ward Type</TableCell>
                  <TableCell>Admission Date</TableCell>
                  <TableCell>Discharge Date</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admissions.length > 0 ? (
                  admissions.map((admission) => (
                    <TableRow key={getAdmissionId(admission)}>
                      <TableCell>
                        <Link to={`/patients/${admission.patientId}`} style={{ color: '#1976d2', textDecoration: 'none' }}>
                          {admission.patientName || (admission.patientId?.name || 'Unknown Patient')}
                        </Link>
                      </TableCell>
                      <TableCell>{admission.roomNumber}</TableCell>
                      <TableCell>{admission.wardType}</TableCell>
                      <TableCell>{formatDate(admission.admissionDate)}</TableCell>
                      <TableCell>{formatDate(admission.dischargeDate) || 'Not discharged'}</TableCell>
                      <TableCell>
                        <Link to={`/doctors/${admission.doctorId}`} style={{ color: '#1976d2', textDecoration: 'none' }}>
                          {admission.doctorName || (admission.doctorId?.name || 'Unknown Doctor')}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={admission.status}
                          color={getStatusColor(admission.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton
                            component={Link}
                            to={`/admissions/${getAdmissionId(admission)}`}
                            size="small"
                            color="primary"
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            component={Link}
                            to={`/admissions/${getAdmissionId(admission)}/edit`}
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteAdmission(getAdmissionId(admission))}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">No admission records found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalAdmissions}
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

export default AdmissionsList; 