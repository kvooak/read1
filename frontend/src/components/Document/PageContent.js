import React from 'react';
import styled from '@emotion/styled';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

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
      <DndProvider backend={HTML5Backend}>
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
      </DndProvider>
    </BlocksWrapper>
  );
}
