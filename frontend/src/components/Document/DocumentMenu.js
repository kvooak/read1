import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import StandardChip from '../../_custom/UI/StandardChip';

const MenuWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 12px;
`;

export default function DocumentMenu(props) {
  const { addBlock } = props;

  return (
    <MenuWrapper>
      <StandardChip
        size="small"
        onClick={addBlock}
        label="+1 line"
      />
    </MenuWrapper>
  );
}

DocumentMenu.propTypes = {
  addBlock: PropTypes.func.isRequired,
};
