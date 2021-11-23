/* eslint no-underscore-dangle: 0 */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import StandardIconButton from '../../_custom/UI/StandardIconButton';
import StandardPopover from '../../_custom/UI/StandardPopover';

import BlockMenu from './BlockMenu';
import clientSocket from './functions/socket';

const InterfaceWrapper = styled.div`
	padding-right: 4px;
`;

const MenuButtonGroup = (props) => {
  const { toggleMenu, addBlock } = props;

  return (
    <Stack direction="row">
      <StandardIconButton onClick={addBlock}>
        <AddIcon sx={{ color: 'rgba(15, 15, 15, 0.4)' }} />
      </StandardIconButton>
      <StandardIconButton onClick={toggleMenu}>
        <ModeEditIcon sx={{ color: 'rgba(15, 15, 15, 0.4)' }} />
      </StandardIconButton>
    </Stack>
  );
};

MenuButtonGroup.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
  addBlock: PropTypes.func.isRequired,
};

const BlockMenuInterface = React.forwardRef((props, ref) => {
  const { blockId } = props;
  const documentStore = useSelector((state) => state.document);

  const [anchorEl, setAnchorEl] = useState(null);
  const handleToggleMenu = (event) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleAddBlock = () => {
    clientSocket.createBlock({
      parent_id: documentStore.identity._key,
      settings: {
        type: 'translator',
        position: { below: blockId },
      },
    });
  };

  const openMenu = Boolean(anchorEl);
  const menuId = openMenu ? `menu-${blockId}` : undefined;

  return (
    <InterfaceWrapper ref={ref}>
      <MenuButtonGroup
        id={blockId}
        toggleMenu={handleToggleMenu}
        addBlock={handleAddBlock}
      />

      <StandardPopover
        id={menuId}
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
        <BlockMenu blockId={blockId} />
      </StandardPopover>
    </InterfaceWrapper>
  );
});

BlockMenuInterface.propTypes = {
  blockId: PropTypes.string.isRequired,
};

export default BlockMenuInterface;
