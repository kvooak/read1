import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import StandardButton from '../../_custom/UI/StandardButton';

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
      <StandardButton
        size="small"
        variant="outlined"
        onClick={addBlock}
      >
        +1 line
      </StandardButton>
    </MenuWrapper>
  );
}

DocumentMenu.propTypes = {
  addBlock: PropTypes.func.isRequired,
};
