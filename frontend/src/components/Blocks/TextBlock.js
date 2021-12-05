/* eslint no-underscore-dangle: 0 */
import React, { useEffect, useContext, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import striptags from 'striptags';
import { useDrag, useDrop } from 'react-dnd';

import store from '../Document/functions/store';
import { PageContext } from '../Document/PageStore';
import useDebounce from '../../_custom/Hook/useDebounce';
import StandardEditable from '../../_custom/UI/StandardEditable';

const handleStyle = {
  backgroundColor: 'green',
  width: '0px',
  height: '0px',
  display: 'flex',
  cursor: 'move',
  position: 'absolute',
};

const Wrapper = styled.div`
  display: inline-flex;
  flex: 1;
  width: 100%;
`;

const BlockWrapper = React.forwardRef((props, ref) => {
  const { children, id } = props;

  return (
    <Wrapper className="block" id={id} ref={ref}>
      {children}
    </Wrapper>
  );
});

BlockWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
};

const htmlStripper = striptags.init_streaming_mode([], '');

export default function TextBlock(props) {
  const { useSelector, dispatch } = useContext(PageContext);
  const {
    block,
    findBlock,
    onChange,
    moveBlock,
    onMount,
    onFocus,
    onReadDownKeyCommand,
    styles,
  } = props;

  const { blockWithHandleID } = useSelector((state) => state.settings);
  const isDragHandleInit = block.id === blockWithHandleID;

  const content = block.properties.title[0][0];
  const [blockRef, setBlockRef] = useState(null);
  useEffect(() => {
    if (blockRef) onMount(blockRef);
  }, [blockRef]);

  const [bufferOperations, setBufferOperations] = useState([]);
  const operations = useDebounce(bufferOperations, 200);
  useEffect(() => {
    if (operations.length) onChange(operations);
  }, [operations]);

  const handleChange = (event) => {
    const { innerHTML } = event.currentTarget;
    const cleanContent = htmlStripper(innerHTML);
    const contentOperation = {
      pointer: {
        collection: 'blocks',
        id: block.id,
      },
      command: 'update',
      args: [[cleanContent]],
      path: ['properties', 'title'],
    };

    const timestampOperation = {
      pointer: {
        collection: 'blocks',
        id: block.id,
      },
      command: 'set',
      args: Date.now(),
      path: ['last_edited_time'],
    };
    setBufferOperations([contentOperation, timestampOperation]);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
    }
    onReadDownKeyCommand(event);
  };

  const [placeholder, setPlaceholder] = useState(' ');
  const handleFocus = (event) => {
    let text = 'Type : for options';
    switch (block.type) {
      case 'text':
        break;
      case 'header':
        text = 'Header 1';
        break;
      case 'sub_header':
        text = 'Header 2';
        break;
      case 'sub_sub_header':
        text = 'Header 3';
        break;
      default:
        text = ' ';
        break;
    }
    setPlaceholder(text);
    onFocus(event);
  };

  const handleBlur = () => {
    setPlaceholder(' ');
  };

  const originalIndex = findBlock(block.id).index;
  const [{ opacity }, drag, preview] = useDrag(
    () => ({
      type: 'block',
      item: { id: block.id, originalIndex },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
      end: (target, monitor) => {
        const { id } = target;
        const didCancel = monitor.didDrop();
        if (!didCancel) moveBlock(id, originalIndex);
      },
    }),
    [block.id, originalIndex, moveBlock],
  );

  const [, drop] = useDrop(
    () => ({
      accept: 'block',
      canDrop: () => false,
      hover(target) {
        // target = the block being dropped on
        const { id } = target;
        if (id !== block.id) {
          const { index } = findBlock(block.id);
          // move the hovered block to index of current block
          moveBlock(id, index);
        }
      },
    }),
    [findBlock, moveBlock],
  );

  const Editable = (
    <StandardEditable
      anchor
      placeholder={placeholder}
      blockId={block.id}
      styles={styles}
      content={content}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );

  const [dragHandleRef, setDragHandleRef] = useState(null);
  const handleDragHandleRef = (node) => {
    setDragHandleRef(node);
    setBlockRef(node);
    if (isDragHandleInit) return drag(drop(node));
    return node;
  };
  useEffect(() => {
    dispatch(store.actions.blockDragHandleReceived({ drag, drop }));
  }, [dragHandleRef]);

  const Block = (
    <BlockWrapper ref={handleDragHandleRef} id={block.id}>
      <div ref={preview} style={{ opacity, width: '100%' }}>
        {Editable}
      </div>
    </BlockWrapper>
  );

  return Block;
}
