import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, Paper, CircularProgress, Button } from '@mui/material';
import { 
  Person as PatientIcon,
  MedicalServices as DoctorIcon,
  EventNote as AppointmentIcon,
  AccessTime as TodayIcon,
  People as StaffIcon,
  AttachMoney as FinanceIcon
} from '@mui/icons-material';
import * as dashboardService from '../services/dashboardService';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    todayAppointments: 0
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Fetch statistics from API using dashboardService
        const response = await dashboardService.getStatistics();
        setStats({
          totalPatients: response.totalPatients,
          totalDoctors: response.totalDoctors,
          totalAppointments: response.totalAppointments,
          todayAppointments: response.todayAppointments
        });
      } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
        // Set mock data if API call fails
        setStats({
          totalPatients: 1205,
          totalDoctors: 85,
          totalAppointments: 345,
          todayAppointments: 24
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Dashboard stat cards
  const statCards = [
    { title: 'Total Patients', value: stats.totalPatients, icon: PatientIcon, color: '#1976d2' },
    { title: 'Total Doctors', value: stats.totalDoctors, icon: DoctorIcon, color: '#e91e63' },
    { title: 'Total Appointments', value: stats.totalAppointments, icon: AppointmentIcon, color: '#4caf50' },
    { title: 'Today\'s Appointments', value: stats.todayAppointments, icon: TodayIcon, color: '#ff9800' }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Dashboard
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {statCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      height: '100%',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          bgcolor: card.color,
                          color: 'white',
                          width: 56,
                          height: 56,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                        }}
                      >
                        <Icon fontSize="large" />
                      </Box>
                      <Box>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                          {card.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {card.title}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>

          {/* Quick Access Section */}
          <Typography variant="h5" mt={4} mb={2}>
            Quick Access
          </Typography>
          <Grid container spacing={3}>
            {/* Staff Dashboard Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={3}
                component={Link}
                to="/staff/dashboard"
                sx={{
                  p: 3,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                }}
              >
                <Box
                  sx={{
                    bgcolor: '#9c27b0', // Purple color for staff
                    color: 'white',
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <StaffIcon fontSize="large" />
                </Box>
                <Box>
                  <Typography variant="h6" component="div">
                    Staff Dashboard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage staff, attendance, and departments
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            {/* Financial Dashboard Card */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={3}
                component={Link}
                to="/financial/dashboard"
                sx={{
                  p: 3,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                }}
              >
                <Box
                  sx={{
                    bgcolor: '#2e7d32', // Green color for finance
                    color: 'white',
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <FinanceIcon fontSize="large" />
                </Box>
                <Box>
                  <Typography variant="h6" component="div">
                    Financial Dashboard
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage billing, claims, and revenue tracking
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Dashboard; 
 