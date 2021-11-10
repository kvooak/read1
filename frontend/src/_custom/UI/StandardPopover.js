/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import Popover from '@mui/material/Popover';

const styles = () => ({
  paper: {
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
    padding: '4px',
  },
});

const StyledPopover = withStyles(styles)(Popover);
export default function StandardPopover({ children, ...props }) {
  const {
    id,
    open,
    anchorEl,
    onClose,
    anchorOrigin,
    transformOrigin,
    ...rest
  } = props;

  return (
    <StyledPopover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      {...rest}
    >
      {children}
    </StyledPopover>
  );
}

StandardPopover.defaultProps = {
  id: undefined,
  anchorEl: null,
};

StandardPopover.propTypes = {
  children: PropTypes.instanceOf(Object).isRequired,
  id: PropTypes.string,
  open: PropTypes.bool.isRequired,
  anchorEl: PropTypes.instanceOf(Object),
  anchorOrigin: PropTypes.instanceOf(Object).isRequired,
  transformOrigin: PropTypes.instanceOf(Object).isRequired,
  onClose: PropTypes.func.isRequired,
};
