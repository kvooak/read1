/* eslint no-underscore-dangle: 0 */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import striptags from 'striptags';

import useDebounce from '../../_custom/Hook/useDebounce';
import StandardEditable from '../../_custom/UI/StandardEditable';

const BlockWrapper = styled.div`
  display: inline-flex;
  width: 100%;
	border: 1px solid black;
	margin: 1px 0;
`;

const htmlStripper = striptags.init_streaming_mode([], '\n');

export default function TextBlock(props) {
  const {
    block, onChange, onReadDownKeyCommand, onReadUpKeyCommand,
  } = props;
  const [bufferOperations, setBufferOperations] = useState([]);

  const operations = useDebounce(bufferOperations, 200);
  useEffect(() => {
    if (operations.length) onChange(operations);
  }, [operations]);

  const handleChange = (event) => {
    const content = event.currentTarget.innerHTML;
    const cleanContent = htmlStripper(content);
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
      onReadDownKeyCommand(event);
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      onReadUpKeyCommand(event);
    }
  };
  return (
    <BlockWrapper
      id={block.id}
      onChange={() => console.log('trigger')}
    >
      <StandardEditable
        anchor
        blockId={block.id}
        content={block.properties.title[0][0]}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      />
    </BlockWrapper>
  );
}

TextBlock.propTypes = {
  block: PropTypes.instanceOf(Object).isRequired,
  onChange: PropTypes.func.isRequired,
  onReadDownKeyCommand: PropTypes.func.isRequired,
  onReadUpKeyCommand: PropTypes.func.isRequired,
};
