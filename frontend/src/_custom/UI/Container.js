import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const Root = styled('div')(() => ({
  flexGrow: 0,
  flexShrink: 1,
  display: 'flex',
  flexDirection: 'column',
  background: 'white',
  height: 'calc(100vh - 45px)',
  maxHeight: '100%',
  position: 'relative',
}));

export default function Container({ children }) {
  return (
    <Root className="container">
      {children}
    </Root>
  );
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
};
