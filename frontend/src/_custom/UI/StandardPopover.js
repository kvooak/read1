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
const StandardPopover = React.forwardRef(({ children, ...props }, ref) => {
  const {
    id,
    open,
    anchorEl,
    anchorOrigin,
    transformOrigin,
    ...rest
  } = props;

  return (
    <StyledPopover
      ref={ref}
      id={id}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      {...rest}
    >
      {children}
    </StyledPopover>
  );
});

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
};

export default StandardPopover;
