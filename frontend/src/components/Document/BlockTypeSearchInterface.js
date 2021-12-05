import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { withStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import useConditionalKeyInput from '../../_custom/Hook/useConditionalKeyInput';
import blockTypes from './constants/blockTypes';

const typeSearchPaperStyles = () => ({
  root: {
    width: '240px',
    color: 'rgba(55, 53, 47, 0.6)',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
});

const typerSearchResultItemStyles = () => ({});

const TypeSearchPaper = withStyles(typeSearchPaperStyles)(Paper);
const TypeItemWrapper = withStyles(typerSearchResultItemStyles)(MenuItem);
const NoMatchWrapper = styled.div`
  padding: 0px 6px;
`;

const NoMatchText = () => {
  const noMatchText = 'No type matched.';

  return <NoMatchWrapper>{noMatchText}</NoMatchWrapper>;
};
const TypeItem = (props) => {
  const { type, onClick } = props;
  const handleOnClick = () => {
    onClick(type.id);
  };
  return (
    <TypeItemWrapper dense onClick={handleOnClick}>
      <ListItemIcon>{type.icon}</ListItemIcon>
      <ListItemText primary={type.title} secondary={type.subTitle} />
    </TypeItemWrapper>
  );
};

TypeItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.instanceOf(Object).isRequired,
};

export default function BlockTypeSearchInterface(props) {
  const { onTypeSelect, onSearchCancel } = props;

  const [listenToTypeSearch, setListenToTypeSearch] = useState(true);
  const searchQuery = useConditionalKeyInput(listenToTypeSearch);

  useEffect(() => {
    setListenToTypeSearch(true);
    return () => setListenToTypeSearch(false);
  }, []);

  const [types, setTypes] = useState(blockTypes);
  useEffect(() => {
    if (searchQuery.length > 10) {
      onSearchCancel();
    } else if (searchQuery.length === 0) {
      setTypes(blockTypes);
    } else {
      const searchString = searchQuery.substring(1);
      const result = blockTypes.filter((t) => t.id.includes(searchString));
      setTypes(result);
    }
  }, [searchQuery.length]);

  const handleTypeSelect = (type) => {
    onTypeSelect(type);
    onSearchCancel();
  };

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      onSearchCancel();
    } else if (event.key === 'Escape') {
      onSearchCancel();
    }
  };

  const handleClose = () => {
    onSearchCancel();
  };

  return (
    <TypeSearchPaper square elevation={0} variant="outlined">
      <ClickAwayListener onClickAway={handleClose}>
        <MenuList dense onKeyDown={handleListKeyDown}>
          {types.length ? (
            types.map((type) => (
              <TypeItem key={type.id} type={type} onClick={handleTypeSelect} />
            ))
          ) : (
            <NoMatchText />
          )}
        </MenuList>
      </ClickAwayListener>
    </TypeSearchPaper>
  );
}

BlockTypeSearchInterface.propTypes = {
  onTypeSelect: PropTypes.func.isRequired,
  onSearchCancel: PropTypes.func.isRequired,
};
