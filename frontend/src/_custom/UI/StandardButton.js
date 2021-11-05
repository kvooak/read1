import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import Button from '@mui/material/Button';

const styles = (theme) => ({
  root: {
    borderRadius: '4px !important',
    transition: '100ms !important',
  },
});

const StyledButton = withStyles(styles)(Button);

export default function StandardButton({ children, ...props }) {
  return (
    <StyledButton {...props}>
      {children}
    </StyledButton>
  );
}
