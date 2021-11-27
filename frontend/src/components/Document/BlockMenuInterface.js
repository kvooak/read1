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
  const { toggleMenu, addBlock } = props;

  return (
    <Stack direction="row">
      <StandardIconButton onClick={addBlock}>
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
  addBlock: PropTypes.func.isRequired,
};

export default function BlockMenuInterface(props) {
  const { block } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const handleToggleMenu = (event) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleAddBlock = () => {
  };

  const openMenu = Boolean(anchorEl);

  return (
    <InterfaceWrapper>
      <MenuButtonGroup
        toggleMenu={handleToggleMenu}
        addBlock={handleAddBlock}
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
        <BlockMenu block={block} />
      </StandardPopover>
    </InterfaceWrapper>
  );
}

BlockMenuInterface.propTypes = {
  block: PropTypes.instanceOf(Object).isRequired,
};
