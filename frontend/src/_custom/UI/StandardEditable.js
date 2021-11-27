import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Editable = styled.div`
	width: 100%;
	height: 100%;
	line-height: 1.5;
	outline: none;
	padding: 3px 2px;

	caret-color: rgba(55, 53, 47, 0.5);
	cursor: text;
	word-break: break-word;
	word-spacing: 0.06rem;
	white-space: pre-wrap;
`;

export default function StandardEditable(props) {
  const {
    anchor,
    blockId,
    content,
    onChange,
    onKeyDown,
  } = props;

  return (
    <Editable
      data-anchor={anchor}
      data-block-id={blockId}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onInput={onChange}
      onKeyDown={onKeyDown}
    >
      {content}
    </Editable>
  );
}

StandardEditable.defaultProps = {
  anchor: false,
  content: '',
};

StandardEditable.propTypes = {
  anchor: PropTypes.bool,
  blockId: PropTypes.string.isRequired,
  content: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
};
