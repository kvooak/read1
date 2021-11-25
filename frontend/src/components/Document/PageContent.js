import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import TextBlock from '../Blocks/TextBlock';

const PageContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`;

export default function PageContent(props) {
  const {
    blocks, onChange, onReadUpKeyCommand, onReadDownKeyCommand,
  } = props;

  const handleMoveCursorUp = () => {

  };
  return (
    <PageContentWrapper>
      {blocks.map((block) => (
        <TextBlock
          key={block.id}
          block={block}
          onChange={onChange}
          onReadDownKeyCommand={onReadDownKeyCommand}
          onReadUpKeyCommand={onReadUpKeyCommand}
          moveCursorUp={handleMoveCursorUp}
        />
      ))}
    </PageContentWrapper>
  );
}

PageContent.propTypes = {
  blocks: PropTypes.instanceOf(Array).isRequired,
  onChange: PropTypes.func.isRequired,
  onReadDownKeyCommand: PropTypes.func.isRequired,
  onReadUpKeyCommand: PropTypes.func.isRequired,
};
