import { useState } from 'react';
import { 
  List, ListItem, ListItemText, ListItemAvatar, 
  Avatar, Typography, Paper, Box, Divider, 
  Chip, IconButton, Menu, MenuItem, ListItemIcon,
  Badge, Tooltip, Stack, Button
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WorkIcon from '@mui/icons-material/Work';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EventIcon from '@mui/icons-material/Event';
import { format, isToday, isTomorrow, addDays } from 'date-fns';
import axios from 'axios';

function StaffNotifications({ notificationData }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [markAllAsRead, setMarkAllAsRead] = useState(false);
  
  const handleMenuClick = (event, notification) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Function to format date in a user-friendly way
  const formatDate = (date) => {
    const dateObj = new Date(date);
    
    if (isToday(dateObj)) {
      return `Today at ${format(dateObj, 'h:mm a')}`;
    } else if (isTomorrow(dateObj)) {
      return `Tomorrow at ${format(dateObj, 'h:mm a')}`;
    } else {
      return format(dateObj, 'MMM dd, yyyy h:mm a');
    }
  };
  
  // Function to get shift duration
  const getShiftDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffHours = (endTime - startTime) / (1000 * 60 * 60);
    return diffHours.toFixed(1);
  };
  
  // Filter shifts for upcoming notifications
  const upcomingShifts = notificationData.filter(shift => 
    new Date(shift.startTime) > new Date() && 
    shift.status === 'Scheduled'
  ).sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  
  // Group shifts by day
  const groupShiftsByDay = () => {
    const grouped = {};
    
    upcomingShifts.forEach(shift => {
      const dateKey = new Date(shift.startTime).toDateString();
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      
      grouped[dateKey].push(shift);
    });
    
    return grouped;
  };
  
  const groupedShifts = groupShiftsByDay();
  
  // Function to get avatar color based on shift type
  const getAvatarColor = (type) => {
    switch (type) {
      case 'Regular':
        return 'primary';
      case 'Overtime':
        return 'secondary';
      case 'On-Call':
        return 'warning';
      case 'Holiday':
        return 'success';
      case 'Weekend':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Function to mark shift as acknowledged
  const acknowledgeShift = async (shiftId) => {
    try {
      await axios.put(`/api/shifts/${shiftId}`, {
        status: 'In Progress'
      });
      
      // Close menu and refresh the page
      handleMenuClose();
      window.location.reload();
    } catch (err) {
      console.error('Error acknowledging shift:', err);
    }
  };
  
  // Function to cancel shift
  const cancelShift = async (shiftId) => {
    try {
      await axios.put(`/api/shifts/${shiftId}`, {
        status: 'Cancelled'
      });
      
      // Close menu and refresh the page
      handleMenuClose();
      window.location.reload();
    } catch (err) {
      console.error('Error cancelling shift:', err);
    }
  };
  
  return (
    <Paper sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" gutterBottom component="div" sx={{ mb: 0 }}>
          Notifications
        </Typography>
        
        <Stack direction="row" spacing={1}>
          <Badge badgeContent={upcomingShifts.length} color="error">
            <Button 
              variant="outlined" 
              startIcon={<NotificationsIcon />}
              onClick={() => setMarkAllAsRead(!markAllAsRead)}
            >
              {markAllAsRead ? "Mark all as unread" : "Mark all as read"}
            </Button>
          </Badge>
        </Stack>
      </Box>
      
      {Object.keys(groupedShifts).length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="body1" color="text.secondary">
            No upcoming notifications
          </Typography>
        </Box>
      ) : (
        Object.entries(groupedShifts).map(([date, shifts], index) => (
          <Box key={date} sx={{ mb: 3 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 1, 
                fontWeight: 'bold',
                color: isToday(new Date(date)) ? 'primary.main' : 'text.primary'
              }}
            >
              {isToday(new Date(date)) ? 'Today' : 
               isTomorrow(new Date(date)) ? 'Tomorrow' :
               format(new Date(date), 'EEEE, MMMM d, yyyy')}
            </Typography>
            
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {shifts.map((shift, idx) => (
                <Box key={shift._id}>
                  <ListItem 
                    alignItems="flex-start"
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        aria-label="more options"
                        onClick={(e) => handleMenuClick(e, shift)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    }
                    sx={{ 
                      opacity: markAllAsRead ? 0.6 : 1,
                      backgroundColor: markAllAsRead ? 'rgba(0, 0, 0, 0.04)' : 'inherit'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${getAvatarColor(shift.type)}.main` }}>
                        <EventIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography component="span" variant="subtitle1">
                            {shift.department} Department Shift
                          </Typography>
                          <Chip 
                            label={shift.type} 
                            size="small" 
                            color={getAvatarColor(shift.type)}
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            Time: {format(new Date(shift.startTime), 'h:mm a')} - {format(new Date(shift.endTime), 'h:mm a')}
                          </Typography>
                          <Typography component="div" variant="body2">
                            Duration: {getShiftDuration(shift.startTime, shift.endTime)} hours
                          </Typography>
                          {shift.notes && (
                            <Typography component="div" variant="body2" sx={{ mt: 0.5 }}>
                              Note: {shift.notes}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  {idx < shifts.length - 1 && <Divider variant="inset" component="li" />}
                </Box>
              ))}
            </List>
          </Box>
        ))
      )}
      
      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => acknowledgeShift(selectedNotification?._id)}>
          <ListItemIcon>
            <TaskAltIcon fontSize="small" />
          </ListItemIcon>
          Acknowledge Shift
        </MenuItem>
        <MenuItem onClick={() => cancelShift(selectedNotification?._id)}>
          <ListItemIcon>
            <DoDisturbIcon fontSize="small" />
          </ListItemIcon>
          Request Cancellation
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <ArrowForwardIcon fontSize="small" />
          </ListItemIcon>
          View Details
        </MenuItem>
      </Menu>
    </Paper>
  );
}

export default StaffNotifications; 