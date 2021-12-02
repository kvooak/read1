import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import TextBlock from '../Blocks/TextBlock';
import blockStyles from './constants/blockStyles';

const TEXT_FAMILY = ['text', 'header', 'sub_header', 'sub_sub_header'];

export default function BlockRenderer(props) {
  const {
    block,
    onChange,
    onMount,
    onFocus,
    onReadDownKeyCommand,
  } = props;
  const { type } = block;

  const blockComponent = useMemo(() => {
    if (TEXT_FAMILY.includes(type)) {
      return (
        <TextBlock
          key={block.id}
          block={block}
          styles={blockStyles[type]}
          onChange={onChange}
          onMount={onMount}
          onFocus={onFocus}
          onReadDownKeyCommand={onReadDownKeyCommand}
        />
      );
    }
    return null;
  }, [type]);

  return blockComponent;
}

BlockRenderer.propTypes = {
  block: PropTypes.instanceOf(Object).isRequired,
  onChange: PropTypes.func.isRequired,
  onReadDownKeyCommand: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onMount: PropTypes.func.isRequired,
};
