import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContentDelete from '@mui/icons-material/Delete';
import ContentMove from '@mui/icons-material/TrendingFlat';
import ContentCopy from '@mui/icons-material/ContentCopy';

import clientSocket from '../../socket';

const paperStyles = () => ({
});

const menuBlockItemStyles = () => ({
});

const MenuBlockPaper = withStyles(paperStyles)(Paper);
const MenuBlockItem = withStyles(menuBlockItemStyles)(MenuItem);

export default function BlockMenu(props) {
  const { blockId } = props;

  const handleDeleteBlock = () => {
    clientSocket.destroyBlock(blockId);
  };

  return (
    <MenuBlockPaper
      square
      elevation={0}
      variant="outlined"
    >
      <MenuList dense>
        <MenuBlockItem dense onClick={handleDeleteBlock}>
          <ListItemIcon>
            <ContentDelete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuBlockItem>

        <MenuBlockItem dense>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuBlockItem>

        <MenuBlockItem dense sx={{ borderTop: '1px solid rgba(55,53,47,0.1)' }}>
          <ListItemIcon>
            <ContentMove fontSize="small" />
          </ListItemIcon>
          <ListItemText>Move to</ListItemText>
        </MenuBlockItem>
      </MenuList>
    </MenuBlockPaper>
  );
}

BlockMenu.propTypes = {
  blockId: PropTypes.string.isRequired,
};
