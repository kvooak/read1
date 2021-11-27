/* eslint no-underscore-dangle: 0 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import StandardIconButton from '../../_custom/UI/StandardIconButton';
import StandardPopover from '../../_custom/UI/StandardPopover';

import BlockMenu from './BlockMenu';

const InterfaceWrapper = styled.div`
	padding: 3px 6px 3px 2px;
	line-height: 1.5;
`;

const MenuButtonGroup = (props) => {
  const { toggleMenu, onAdd } = props;
  const handleAddEmptyBlock = () => {
    onAdd();
  };

  return (
    <Stack direction="row">
      <StandardIconButton onClick={handleAddEmptyBlock}>
        <AddIcon sx={{ color: 'rgba(15, 15, 15, 0.2)' }} />
      </StandardIconButton>
      <StandardIconButton onClick={toggleMenu}>
        <ModeEditIcon sx={{ color: 'rgba(15, 15, 15, 0.2)' }} />
      </StandardIconButton>
    </Stack>
  );
};

MenuButtonGroup.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default function BlockMenuInterface(props) {
  const { block, onKill, onAdd } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const handleToggleMenu = (event) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleOnKill = (blockID) => {
    onKill(blockID);
    setAnchorEl(null);
  };

  const handleOnAdd = (args) => {
    onAdd(args);
    setAnchorEl(null);
  };

  const openMenu = Boolean(anchorEl);

  return (
    <InterfaceWrapper>
      <MenuButtonGroup
        toggleMenu={handleToggleMenu}
        onAdd={handleOnAdd}
      />

      <StandardPopover
        open={openMenu}
        anchorEl={anchorEl}
        onClose={handleToggleMenu}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
      >
        <BlockMenu
          block={block}
          onKill={handleOnKill}
          onAdd={handleOnAdd}
        />
      </StandardPopover>
    </InterfaceWrapper>
  );
}

BlockMenuInterface.defaultProps = {
  block: {},
};

BlockMenuInterface.propTypes = {
  block: PropTypes.instanceOf(Object),
  onAdd: PropTypes.func.isRequired,
  onKill: PropTypes.func.isRequired,
};
