/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import Popper from '@mui/material/Popper';

export default function StandardPopper({ children, ...props }) {
  const {
    id,
    open,
    anchorEl,
    placement,
    ...rest
  } = props;

  return (
    <Popper
      data-block-id={id}
      open={open}
      anchorEl={anchorEl}
      placement={placement}
      {...rest}
    >
      {children}
    </Popper>
  );
}

StandardPopper.propTypes = {
  children: PropTypes.instanceOf(Object).isRequired,
  id: PropTypes.string.isRequired,
  placement: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  anchorEl: PropTypes.instanceOf(Object).isRequired,
};
