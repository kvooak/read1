import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Editable = styled.div`
	padding: 6px 8px 8px 8px;
	width: 100%;
	height: 100%;
	outline: none;

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
    onFocus,
    onChange,
    onKeyDown,
    onKeyUp,
  } = props;

  return (
    <Editable
      data-anchor={anchor}
      data-block-id={blockId}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onInput={onChange}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
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
  onFocus: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  onKeyUp: PropTypes.func.isRequired,
};
