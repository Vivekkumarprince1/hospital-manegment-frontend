import { useState } from 'react';
import { 
  Grid, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, TablePagination,
  Chip, TextField, InputAdornment, Box, Button, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';

function StaffRoster({ staffData }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter staff data based on search term and department filter
  const filteredStaff = staffData.filter(staff => {
    const nameMatch = (staff.firstName + ' ' + staff.lastName).toLowerCase().includes(searchTerm.toLowerCase());
    const departmentMatch = !departmentFilter || staff.department === departmentFilter;
    return nameMatch && departmentMatch;
  });

  // Get unique departments for filtering
  const departments = [...new Set(staffData.map(staff => staff.department))];

  // Get status chip color based on isActive
  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'error';
  };

  return (
    <Paper sx={{ width: '100%', p: 2 }}>
      <Typography variant="h5" gutterBottom component="div" sx={{ mb: 2 }}>
        Staff Roster
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            select
            fullWidth
            variant="outlined"
            label="Filter by Department"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterListIcon />
                </InputAdornment>
              ),
            }}
            SelectProps={{
              native: true,
            }}
          >
            <option value="">All Departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            variant="contained" 
            component={Link} 
            to="/staff/new"
            sx={{ height: '56px' }}
            fullWidth
          >
            Add Staff
          </Button>
        </Grid>
      </Grid>
      
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="staff roster table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStaff
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((staff) => (
                <TableRow key={staff._id} hover>
                  <TableCell component="th" scope="row">
                    {staff.firstName} {staff.lastName}
                  </TableCell>
                  <TableCell>{staff.department}</TableCell>
                  <TableCell>{staff.position}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{staff.email}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {staff.contactNumber}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={staff.isActive ? 'Active' : 'Inactive'} 
                      color={getStatusColor(staff.isActive)} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      component={Link} 
                      to={`/staff/${staff._id}`}
                      color="primary"
                      size="small"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {filteredStaff.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No staff members found
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
        count={filteredStaff.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default StaffRoster; 