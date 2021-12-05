/* eslint no-underscore-dangle: 0 */
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import { PageContext } from './PageStore';
import store from './functions/store';
import StandardIconButton from '../../_custom/UI/StandardIconButton';
import StandardPopover from '../../_custom/UI/StandardPopover';

import BlockMenu from './BlockMenu';

const InterfaceWrapper = styled.div`
  padding: 3px 6px 3px 2px;
  line-height: 1.3;
`;

const MenuButtonGroup = (props) => {
  const { dispatch, useSelector } = useContext(PageContext);
  const { blockID, onMenuToggle, onAdd } = props;

  const dragHandler = useSelector((s) => s.settings.blockDragHandle);
  const handleAddEmptyBlock = () => {
    onAdd(blockID);
  };

  const handleInitDragHandle = () => {
    dispatch(store.actions.blockWithHandleID(blockID));
  };

  const handleClearDragHandle = () => {
    dispatch(store.actions.blockWithHandleID(null));
  };

  const handleDragProxy = (node) => {
    const { drag, drop } = dragHandler;
    return drag(drop(node));
  };

  return (
    <Stack direction="row">
      <StandardIconButton onClick={handleAddEmptyBlock}>
        <AddIcon sx={{ color: 'rgba(15, 15, 15, 0.2)' }} />
      </StandardIconButton>
      <StandardIconButton onClick={onMenuToggle}>
        <ModeEditIcon sx={{ color: 'rgba(15, 15, 15, 0.2)' }} />
      </StandardIconButton>
      <StandardIconButton
        ref={handleDragProxy}
        onMouseOver={handleInitDragHandle}
        onMouseLeave={handleClearDragHandle}
        cursor="move"
      >
        <DragIndicatorIcon sx={{ color: 'rgba(15, 15, 15, 0.2)' }} />
      </StandardIconButton>
    </Stack>
  );
};

MenuButtonGroup.propTypes = {
  blockID: PropTypes.string.isRequired,
  onMenuToggle: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default function BlockMenuInterface(props) {
  const { useSelector } = useContext(PageContext);
  const { onKill, onAdd } = props;

  const block = useSelector((state) => state.settings.hoveredBlockData);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleOnMenuToggle = (event) => {
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

  const handleOnAdd = (...args) => {
    onAdd(...args);
    setAnchorEl(null);
  };

  return (
    <InterfaceWrapper>
      <MenuButtonGroup
        blockID={block.id}
        onMenuToggle={handleOnMenuToggle}
        onAdd={handleOnAdd}
      />

      <StandardPopover
        open={openMenu}
        anchorEl={anchorEl}
        onClose={handleOnMenuToggle}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
      >
        <BlockMenu block={block} onKill={handleOnKill} onAdd={handleOnAdd} />
      </StandardPopover>
    </InterfaceWrapper>
  );
}

BlockMenuInterface.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onKill: PropTypes.func.isRequired,
};
