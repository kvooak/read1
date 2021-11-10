/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import Popper from '@mui/material/Popper';

const StandardPopper = React.forwardRef(({ children, ...props }, ref) => {
  const {
    id,
    open,
    anchorEl,
    placement,
    ...rest
  } = props;

  return (
    <Popper
      ref={ref}
      id={id}
      open={open}
      anchorEl={anchorEl}
      placement={placement}
      {...rest}
    >
      {children}
    </Popper>
  );
});

StandardPopper.defaultProps = {
  id: undefined,
  anchorEl: null,
};

StandardPopper.propTypes = {
  children: PropTypes.instanceOf(Object).isRequired,
  id: PropTypes.string,
  placement: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  anchorEl: PropTypes.instanceOf(Object),
};

export default StandardPopper;
