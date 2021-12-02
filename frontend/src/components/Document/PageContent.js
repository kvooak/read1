import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import BlockRenderer from './BlockRenderer';

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
    onFocus,
  } = props;

  return (
    <BlocksWrapper className="blocks-wrapper">
      {blocks.map((block) => (
        <BlockRenderer
          key={block.id}
          block={block}
          onChange={onChange}
          onMount={onMount}
          onFocus={onFocus}
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
  onFocus: PropTypes.func.isRequired,
  onMount: PropTypes.func.isRequired,
};
