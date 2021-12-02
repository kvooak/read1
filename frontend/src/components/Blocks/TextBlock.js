/* eslint no-underscore-dangle: 0 */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import striptags from 'striptags';

import useDebounce from '../../_custom/Hook/useDebounce';
import StandardEditable from '../../_custom/UI/StandardEditable';

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
  const {
    block,
    onChange,
    onMount,
    onFocus,
    onReadDownKeyCommand,
    styles,
  } = props;

  const content = block.properties.title[0][0];

  const blockRef = useRef(block.id);
  useEffect(() => {
    if (blockRef.current) onMount(blockRef.current);
  }, [blockRef.current]);

  const [bufferOperations, setBufferOperations] = useState([]);
  const operations = useDebounce(bufferOperations, 200);
  useEffect(() => {
    if (operations.length) onChange(operations);
  }, [operations]);

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

  return (
    <BlockWrapper ref={blockRef} id={block.id}>
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
    </BlockWrapper>
  );
}

TextBlock.propTypes = {
  block: PropTypes.instanceOf(Object).isRequired,
  onChange: PropTypes.func.isRequired,
  onMount: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onReadDownKeyCommand: PropTypes.func.isRequired,
  styles: PropTypes.instanceOf(Object).isRequired,
};
