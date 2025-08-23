import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  TextField,
  Button,
  Stack,
  Divider,
  Alert
} from "@mui/material";
import { 
  Email, 
  GitHub, 
  LinkedIn, 
  LocationOn, 
  Phone, 
  Send 
} from "@mui/icons-material";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setShowSuccess(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
          Get In Touch
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
          Have questions about KeebStation or want to discuss development opportunities? 
          I'd love to hear from you!
        </Typography>
      </Box>

      {/* Success Alert */}
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 4 }}>
          Thank you for your message! I'll get back to you soon.
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Contact Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={2} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom color="primary" mb={3}>
              Send a Message
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                  />
                </Grid>
                
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    multiline
                    rows={6}
                    variant="outlined"
                    placeholder="Tell me about your project, questions, or just say hello!"
                  />
                </Grid>
                
                <Grid size={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<Send />}
                    sx={{ 
                      px: 4, 
                      py: 1.5,
                      backgroundImage: "linear-gradient(to right, #2563eb, #06b6d4)",
                      fontWeight: "bold"
                    }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Contact Information */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={3}>
            {/* Developer Info */}
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom color="primary">
                Developer Info
              </Typography>
              
              <Stack spacing={2}>
                <Box display="flex" alignItems="center">
                  <Email sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      your.email@example.com
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center">
                  <LocationOn sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="body1">
                      Available for Remote Work
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center">
                  <Phone sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Response Time
                    </Typography>
                    <Typography variant="body1">
                      Within 24 hours
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Paper>

            {/* Social Links */}
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom color="primary">
                Connect With Me
              </Typography>
              
              <Stack spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<GitHub />}
                  fullWidth
                  href="https://github.com/yourusername"
                  target="_blank"
                  sx={{ justifyContent: 'flex-start' }}
                >
                  GitHub Profile
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<LinkedIn />}
                  fullWidth
                  href="https://linkedin.com/in/yourprofile"
                  target="_blank"
                  sx={{ justifyContent: 'flex-start' }}
                >
                  LinkedIn Profile
                </Button>
              </Stack>
            </Paper>

            {/* Project Info */}
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="primary">
                About This Project
              </Typography>
              <Typography variant="body2" color="text.secondary">
                KeebStation is a personal learning project showcasing modern 
                full-stack development. Feel free to explore the code, suggest 
                improvements, or discuss potential collaborations!
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary">
                <strong>Tech Stack:</strong> React, ASP.NET Core, Material-UI, 
                Entity Framework, SQLite, Cloudinary
              </Typography>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}