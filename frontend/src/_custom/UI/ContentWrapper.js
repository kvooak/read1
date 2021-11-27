import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: '1',
  alignItems: 'stretch',

  cursor: 'text',

  height: '100vh',
  paddingBottom: '20vh',
  color: 'rgb(55, 53, 47)',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',

  [theme.breakpoints.up('sm')]: {
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(10),
  },
  [theme.breakpoints.up('md')]: {
    paddingLeft: theme.spacing(15),
    paddingRight: theme.spacing(15),
  },
  [theme.breakpoints.up('lg')]: {
    paddingLeft: theme.spacing(40),
    paddingRight: theme.spacing(40),
  },
  [theme.breakpoints.up('xl')]: {
    paddingLeft: theme.spacing(46),
    paddingRight: theme.spacing(46),
  },
}));

export default function ContentWrapper({ children, ...props }) {
  const { onMouseMove } = props;

  return (
    <Root
      className="content-wrapper"
      onMouseMove={onMouseMove}
    >
      {children}
    </Root>
  );
}

ContentWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  onMouseMove: PropTypes.func.isRequired,
};
