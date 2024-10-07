import React from 'react';
import { Box } from '@mui/material';
import  UpdateUserData  from './UpdateUserData';
import  UpdateUserPassword  from './UpdateUserPassword';

const UpdateMainUserSection = () => {
  return (
<Box
sx={{
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  alignItems: 'baseline',
  justifyContent: 'space-around',
  width: '100%',
  margin: '0 auto',
  padding: '20px',
}}

>

      
      <UpdateUserData />
      <UpdateUserPassword />


  </Box>
  );
};

export default UpdateMainUserSection;
