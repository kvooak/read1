import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import ModeEditIcon from '@mui/icons-material/ModeEdit';
import StandardIconButton from '../../_custom/UI/StandardIconButton';
import StandardPopover from '../../_custom/UI/StandardPopover';

import BlockMenu from './BlockMenu';

const InterfaceWrapper = styled.div`
	padding-right: 4px;
`;

const MenuButton = (props) => {
  const { onClick } = props;
  return (
    <StandardIconButton onClick={onClick}>
      <ModeEditIcon fontSize="small" sx={{ color: 'rgba(15, 15, 15, 0.4)' }} />
    </StandardIconButton>
  );
};

MenuButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const BlockMenuInterface = React.forwardRef((props, ref) => {
  const { blockId } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const toggleMenu = (event) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const openMenu = Boolean(anchorEl);
  const menuId = openMenu ? `menu-${blockId}` : undefined;

  return (
    <InterfaceWrapper ref={ref}>
      <MenuButton id={blockId} onClick={toggleMenu} />

      <StandardPopover
        id={menuId}
        open={openMenu}
        anchorEl={anchorEl}
        onClose={toggleMenu}
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
