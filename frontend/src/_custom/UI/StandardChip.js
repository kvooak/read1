import React from 'react';
import { withStyles } from '@mui/styles';
import Chip from '@mui/material/Chip';

const styles = () => ({
  root: {
    borderRadius: '4px',
    background: 'rgba(55, 53, 47, 0.06)',
    fontWeight: '600',
    color: 'rgba(55, 53, 47, 0.6)',
  },
});

const StyledChip = withStyles(styles)(Chip);

export default function StandardChip({ children, ...props }) {
  return (
    <StyledChip {...props} />
  );
}
