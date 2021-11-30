import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { withStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

import blockTypes from './constants/blockTypes';

const typeSearchPaperStyles = () => ({
  root: {
    width: '240px',
    color: 'rgba(55, 53, 47, 0.6)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
});

const typerSearchResultItemStyles = () => ({
});

const TypeSearchPaper = withStyles(typeSearchPaperStyles)(Paper);
const TypeItemWrapper = withStyles(typerSearchResultItemStyles)(MenuItem);
const InterfaceWrapper = styled.div`
padding: 3px 6px 3px 2px;
line-height: 1.5;
`;
const NoMatchWrapper = styled.div`
padding: 0px 6px;
`;

const NoMatchText = () => {
  const noMatchText = 'No type matched.';

  return (
    <NoMatchWrapper>{noMatchText}</NoMatchWrapper>
  );
};
const TypeItem = (props) => {
  const { type, onClick } = props;
  return (
    <TypeItemWrapper dense onClick={onClick}>
      <ListItemIcon>{type.icon}</ListItemIcon>
      <ListItemText
        primary={type.title}
        secondary={type.subTitle}
      />
    </TypeItemWrapper>
  );
};

TypeItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.instanceOf(Object).isRequired,
};

export default function BlockTypeSearchInterface(props) {
  const { searchQuery } = props;

  const [types, setTypes] = useState(blockTypes);
  useEffect(() => {
    if (searchQuery) {
      const searchString = searchQuery.substring(1);
      const results = blockTypes.filter(
        (type) => type.id.includes(searchString),
      );
      setTypes(results);
      return;
    }
    setTypes(blockTypes);
  }, [searchQuery]);

  const handleTypeSelection = () => {

  };

  return (
    <InterfaceWrapper>
      <TypeSearchPaper
        square
        elevation={0}
        variant="outlined"
      >
        <MenuList dense>
          {types.length ? types.map((type) => (
            <TypeItem
              key={type.id}
              type={type}
              onClick={handleTypeSelection}
            />
          )) : (
            <NoMatchText />
          )}
        </MenuList>
      </TypeSearchPaper>
    </InterfaceWrapper>
  );
}

BlockTypeSearchInterface.defaultProps = {
  searchQuery: '',
};

BlockTypeSearchInterface.propTypes = {
  searchQuery: PropTypes.string,
};
