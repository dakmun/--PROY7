import { Box,  Typography, Link, IconButton, Grid2 } from '@mui/material';
import { Facebook as FacebookIcon, Twitter as TwitterIcon, Instagram as InstagramIcon, LinkedIn as LinkedInIcon } from '@mui/icons-material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: '#1c1c1c',
        color: '#fff',
        width: '100%',  // Ocupa todo el ancho del viewport
        boxSizing: 'border-box',
      }}
    >
      {/* Reemplazamos Container por Box */}
      <Box sx={{ maxWidth: '100%', margin: '0 auto', width: '100%' }}>
        <Grid2 container spacing={4} justifyContent="center">
          <Grid2 item='true' xs={12} sm={3}>
            <Typography variant="h6" gutterBottom>
              Company
            </Typography>
            <ul>
              <li>
                <Link href="#" variant="body2" color="inherit" underline="hover">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" variant="body2" color="inherit" underline="hover">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" variant="body2" color="inherit" underline="hover">
                  Careers
                </Link>
              </li>
            </ul>
          </Grid2>

          <Grid2 item='true' xs={12} sm={3}>
            <Typography variant="h6" gutterBottom>
              Support
            </Typography>
            <ul>
              <li>
                <Link href="#" variant="body2" color="inherit" underline="hover">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" variant="body2" color="inherit" underline="hover">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" variant="body2" color="inherit" underline="hover">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </Grid2>

          <Grid2 item='true' xs={12} sm={3}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                 
                href="https://facebook.com"
                target="_blank"
                rel="noopener"
                sx={{ color: '#fff' }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                 
                href="https://twitter.com"
                target="_blank"
                rel="noopener"
                sx={{ color: '#fff' }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                 
                href="https://instagram.com"
                target="_blank"
                rel="noopener"
                sx={{ color: '#fff' }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                 
                href="https://linkedin.com"
                target="_blank"
                rel="noopener"
                sx={{ color: '#fff' }}
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid2>
        </Grid2>

        <Box mt={4} textAlign="center">
          <Typography variant="body2" color="inherit">
            &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

