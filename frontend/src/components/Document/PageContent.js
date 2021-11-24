import React, {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import TextBlock from '../Blocks/TextBlock';

const PageContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`;

export default function PageContent(props) {
  const { blocks, onChange, onReadKeyCommand } = props;

  const handleMoveCursorUp = () => {

  };
  return (
    <PageContentWrapper>
      {blocks.map((block) => (
        <TextBlock
          key={block.id}
          block={block}
          onChange={onChange}
          onReadKeyCommand={onReadKeyCommand}
          moveCursorUp={handleMoveCursorUp}
        />
      ))}
    </PageContentWrapper>
  );
}

PageContent.propTypes = {
  blocks: PropTypes.instanceOf(Array).isRequired,
  onChange: PropTypes.func.isRequired,
  onReadKeyCommand: PropTypes.func.isRequired,
};
