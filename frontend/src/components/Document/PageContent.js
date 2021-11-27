import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import TextBlock from '../Blocks/TextBlock';

const BlocksWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function PageContent(props) {
  const {
    blocks,
    onChange,
    onReadDownKeyCommand,
    onMount,
    onUnmount,
  } = props;

  return (
    <BlocksWrapper
      className="blocks-wrapper"
    >
      {blocks.map((block) => (
        <TextBlock
          key={block.id}
          block={block}
          onChange={onChange}
          onMount={onMount}
          onUnmount={onUnmount}
          onReadDownKeyCommand={onReadDownKeyCommand}
        />
      ))}
    </BlocksWrapper>
  );
}

PageContent.propTypes = {
  blocks: PropTypes.instanceOf(Array).isRequired,
  onChange: PropTypes.func.isRequired,
  onReadDownKeyCommand: PropTypes.func.isRequired,
  onMount: PropTypes.func.isRequired,
  onUnmount: PropTypes.func.isRequired,
};
