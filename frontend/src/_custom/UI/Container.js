import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const Root = styled('div')(({ theme }) => ({
  background: 'rgba(247, 246, 243, 0.4)',
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(1),
  },
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(1),
  },
  [theme.breakpoints.up('lg')]: {
    paddingTop: theme.spacing(1),
  },
}));

export default function Container({ children }) {
  return (
    <Root>
      {children}
    </Root>
  );
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
};
