import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Chip,
  Stack
} from "@mui/material";
import { Code, Storage, Cloud, Security } from "@mui/icons-material";

export default function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
          About KeebStation
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
          A modern e-commerce platform for mechanical keyboard enthusiasts, 
          built as a learning project to showcase full-stack development skills.
        </Typography>
      </Box>

      {/* Project Overview */}
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Project Overview
        </Typography>
        <Typography variant="body1" paragraph>
          KeebStation is a full-stack e-commerce application designed for mechanical keyboard enthusiasts. 
          This project serves as a comprehensive learning platform, demonstrating modern web development 
          practices and technologies.
        </Typography>
        <Typography variant="body1" paragraph>
          From product browsing to secure checkout, every feature is built with scalability and 
          user experience in mind. The application showcases real-world e-commerce functionality 
          including product management, image optimization, and responsive design.
        </Typography>
      </Paper>

      {/* Tech Stack Grid */}
      <Typography variant="h4" gutterBottom color="primary" mb={3}>
        Technology Stack
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        {/* Backend */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Storage sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h5" fontWeight="bold">
                Backend
              </Typography>
            </Box>
            <Stack spacing={1}>
              <Chip label="ASP.NET Core 9.0" variant="outlined" />
              <Chip label="Entity Framework Core" variant="outlined" />
              <Chip label="SQLite Database" variant="outlined" />
              <Chip label="RESTful API Design" variant="outlined" />
            </Stack>
          </Paper>
        </Grid>

        {/* Frontend */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Code sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h5" fontWeight="bold">
                Frontend
              </Typography>
            </Box>
            <Stack spacing={1}>
              <Chip label="React 18" variant="outlined" />
              <Chip label="Material-UI (MUI)" variant="outlined" />
              <Chip label="Vite Build Tool" variant="outlined" />
              <Chip label="Responsive Design" variant="outlined" />
            </Stack>
          </Paper>
        </Grid>

        {/* Cloud Services */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Cloud sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h5" fontWeight="bold">
                Cloud & Services
              </Typography>
            </Box>
            <Stack spacing={1}>
              <Chip label="Cloudinary Image Management" variant="outlined" />
              <Chip label="Docker Containerization" variant="outlined" />
              <Chip label="Azure Deployment Ready" variant="outlined" />
            </Stack>
          </Paper>
        </Grid>

        {/* Development */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Security sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h5" fontWeight="bold">
                Development
              </Typography>
            </Box>
            <Stack spacing={1}>
              <Chip label="TypeScript" variant="outlined" />
              <Chip label="ESLint Code Quality" variant="outlined" />
              <Chip label="Git Version Control" variant="outlined" />
              <Chip label="Clean Architecture" variant="outlined" />
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Learning Goals */}
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          Learning Objectives
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" gutterBottom>
              Technical Skills
            </Typography>
            <Typography variant="body2" component="ul">
              <li>Full-stack web development</li>
              <li>RESTful API design and implementation</li>
              <li>Database design with Entity Framework</li>
              <li>Modern React development patterns</li>
              <li>Cloud service integration</li>
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6" gutterBottom>
              Best Practices
            </Typography>
            <Typography variant="body2" component="ul">
              <li>Clean code architecture</li>
              <li>Responsive web design</li>
              <li>Performance optimization</li>
              <li>Security implementation</li>
              <li>Version control with Git</li>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}