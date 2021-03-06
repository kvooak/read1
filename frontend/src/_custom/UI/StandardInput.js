/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import InputBase from '@mui/material/InputBase';

const styles = () => ({
  root: {
    width: '100%',
  },
});

const StyledInput = withStyles(styles)(InputBase);
export default function StandardInput(props) {
  const {
    onChange,
    multiline,
    value,
    ...rest
  } = props;

  return (
    <StyledInput
      multiline={multiline}
      value={value}
      onChange={onChange}
      spellCheck={false}
      {...rest}
    />
  );
}

StandardInput.defaultProps = {
  multiline: false,
};

StandardInput.propTypes = {
  multiline: PropTypes.bool,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
