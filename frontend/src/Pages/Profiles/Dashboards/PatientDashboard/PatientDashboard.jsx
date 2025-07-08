import './PatientDashboard.css';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventNoteIcon from '@mui/icons-material/EventNote';

function MetricCard({ title, value, icon, color }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
          {icon}
        </Avatar>
        <Box>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5" component="div">
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

function PatientDashboard() {
  const [healthMetrics] = useState({
    heartRate: '72 bpm',
    bloodPressure: '120/80',
    steps: '8,547',
    nextAppointment: 'Mar 15, 2024'
  });

  const [recentActivities] = useState([
    { date: '2024-03-10', activity: 'Completed daily exercise routine', type: 'Exercise' },
    { date: '2024-03-09', activity: 'Took morning medication', type: 'Medication' },
    { date: '2024-03-08', activity: 'Blood pressure check', type: 'Health Check' }
  ]);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Patient Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Health Metrics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Heart Rate"
            value={healthMetrics.heartRate}
            icon={<FavoriteIcon sx={{ fontSize: 32 }} />}
            color="#ef5350"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Blood Pressure"
            value={healthMetrics.bloodPressure}
            icon={<LocalHospitalIcon sx={{ fontSize: 32 }} />}
            color="#42a5f5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Daily Steps"
            value={healthMetrics.steps}
            icon={<DirectionsRunIcon sx={{ fontSize: 32 }} />}
            color="#66bb6a"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Next Appointment"
            value={healthMetrics.nextAppointment}
            icon={<EventNoteIcon sx={{ fontSize: 32 }} />}
            color="#ffa726"
          />
        </Grid>

        {/* Health Progress Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Treatment Progress
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Medication Adherence
              </Typography>
              <LinearProgress variant="determinate" value={85} sx={{ mb: 1 }} />
              <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mt: 2 }}>
                Exercise Completion
              </Typography>
              <LinearProgress variant="determinate" value={70} sx={{ mb: 1 }} />
              <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mt: 2 }}>
                Overall Recovery
              </Typography>
              <LinearProgress variant="determinate" value={60} sx={{ mb: 1 }} />
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activities Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <List>
              {recentActivities.map((activity, index) => (
                <ListItem key={index} divider={index !== recentActivities.length - 1}>
                  <ListItemText
                    primary={activity.activity}
                    secondary={activity.date}
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PatientDashboard;