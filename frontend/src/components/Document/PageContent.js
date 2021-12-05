import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';

import { PageContext } from './PageStore';
import BlockRenderer from './BlockRenderer';

const BlocksWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function PageContent(props) {
  const { useSelector } = useContext(PageContext);
  const { onChange, onReadDownKeyCommand, onMount, onFocus } = props;
  const blocks = useSelector((state) => state.blocks);
  const [dndBlocks, setDndBlocks] = useState([]);

  useEffect(() => {
    setDndBlocks(blocks);
  }, [blocks]);

  const findBlock = useCallback(
    (id) => {
      const block = dndBlocks.find((b) => b.id === id);
      return {
        block,
        index: dndBlocks.indexOf(block),
      };
    },
    [dndBlocks],
  );
  const moveBlock = useCallback(
    (id, toIndex) => {
      const { block, index } = findBlock(id);
      setDndBlocks(
        update(dndBlocks, {
          $splice: [
            [index, 1],
            [toIndex, 0, block],
          ],
        }),
      );
    },
    [findBlock, dndBlocks, setDndBlocks],
  );

  //useEffect(() => {
  //  console.log(dndBlocks);
  //}, [dndBlocks]);

  const [, drop] = useDrop(() => ({ accept: 'block' }));

  return (
    <BlocksWrapper ref={drop} className="blocks-wrapper">
      {dndBlocks.map((block) => (
        <BlockRenderer
          key={block.id}
          block={block}
          findBlock={findBlock}
          moveBlock={moveBlock}
          onChange={onChange}
          onMount={onMount}
          onFocus={onFocus}
          onReadDownKeyCommand={onReadDownKeyCommand}
        />
      ))}
    </BlocksWrapper>
  );
}
