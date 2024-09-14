import React from "react";
import IconButton from "@mui/material/IconButton";
import { Link } from 'react-router-dom';

const MyCustomIcon = () => {
  return (
    <Link to="/">
      <IconButton aria-label="custom icon">
        <img src="/images/header.svg" alt="My Icon" height={50} />
      </IconButton>
    </Link>
  );
};

export default MyCustomIcon;
