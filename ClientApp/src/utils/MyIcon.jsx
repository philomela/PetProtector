import React from 'react';
import IconButton from '@mui/material/IconButton';

const MyCustomIcon = () => {
  return (
    <IconButton aria-label="custom icon">
       <img src="/images/header.svg" alt="My Icon" height={70} />
    </IconButton>
  );
};

export default MyCustomIcon;
