import { useState } from 'react';
import { 
  Grid, Typography, Paper, Box, Card, CardContent, 
  CardHeader, Divider, LinearProgress, Chip, 
  Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, MenuItem, FormControl,
  InputLabel, Select, Alert
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

function DepartmentOverview({ departmentData }) {
  const [workloadDialog, setWorkloadDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [newWorkload, setNewWorkload] = useState('');
  const [error, setError] = useState(null);
  
  const getWorkloadColor = (workload) => {
    switch (workload) {
      case 'Low':
        return '#4caf50'; // Green
      case 'Medium':
        return '#ff9800'; // Orange
      case 'High':
        return '#f44336'; // Red
      case 'Critical':
        return '#9c27b0'; // Purple
      default:
        return '#2196f3'; // Blue
    }
  };
  
  const getWorkloadValue = (workload) => {
    switch (workload) {
      case 'Low':
        return 25;
      case 'Medium':
        return 50;
      case 'High':
        return 75;
      case 'Critical':
        return 100;
      default:
        return 0;
    }
  };
  
  const handleOpenWorkloadDialog = (department) => {
    setSelectedDepartment(department);
    setNewWorkload(department.currentWorkload);
    setWorkloadDialog(true);
  };
  
  const handleUpdateWorkload = async () => {
    try {
      await axios.put(`/api/departments/${selectedDepartment._id}/workload`, {
        currentWorkload: newWorkload
      });
      
      // Close dialog and reload page
      setWorkloadDialog(false);
      window.location.reload();
    } catch (err) {
      console.error('Error updating workload:', err);
      setError(err.response?.data?.message || 'Failed to update workload. Please try again.');
    }
  };
  
  return (
    <Paper sx={{ width: '100%', p: 2 }}>
      <Typography variant="h5" gutterBottom component="div" sx={{ mb: 3 }}>
        Department Overview
      </Typography>
      
      <Grid container spacing={3}>
        {departmentData.map((department) => (
          <Grid item xs={12} md={6} lg={4} key={department._id}>
            <Card 
              variant="outlined" 
              sx={{ 
                height: '100%',
                borderLeft: `5px solid ${getWorkloadColor(department.currentWorkload)}` 
              }}
            >
              <CardHeader
                title={department.name}
                action={
                  <Button 
                    size="small" 
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenWorkloadDialog(department)}
                  >
                    Update
                  </Button>
                }
                titleTypographyProps={{ variant: 'h6' }}
              />
              <Divider />
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Current Workload
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={getWorkloadValue(department.currentWorkload)} 
                        sx={{ 
                          height: 10, 
                          borderRadius: 5,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getWorkloadColor(department.currentWorkload)
                          }
                        }}
                      />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="text.secondary">
                        {department.currentWorkload}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Grid container spacing={2} sx={{ mb: 1 }}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PeopleAltIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        Staff: {department.currentStaffCount} / {department.staffRequirement}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AssignmentIcon color="secondary" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        Location: {department.location || 'Not set'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">
                    {department.understaffing > 0 ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                        <ArrowUpwardIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Understaffed by {department.understaffing}
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                        <ArrowDownwardIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Well-staffed
                      </Box>
                    )}
                  </Typography>
                  {department.headOfDepartment && (
                    <Chip 
                      label={`Head: ${department.headOfDepartment.firstName} ${department.headOfDepartment.lastName}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Update Workload Dialog */}
      <Dialog open={workloadDialog} onClose={() => setWorkloadDialog(false)}>
        <DialogTitle>Update Department Workload</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, minWidth: 400 }}>
            {selectedDepartment && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Department: {selectedDepartment.name}
                </Typography>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="workload-select-label">Current Workload</InputLabel>
                  <Select
                    labelId="workload-select-label"
                    value={newWorkload}
                    onChange={(e) => setNewWorkload(e.target.value)}
                    label="Current Workload"
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Critical">Critical</MenuItem>
                  </Select>
                </FormControl>
                
                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWorkloadDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateWorkload} 
            variant="contained"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default DepartmentOverview; 