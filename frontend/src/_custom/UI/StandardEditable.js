import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Editable = styled.div`
	width: 100%;
	height: 100%;
	line-height: 1.5;
	outline: none;
	padding: 3px 2px;

	caret-color: rgb(55, 53, 47);
	cursor: text;
	word-break: break-word;
	word-spacing: 0.06rem;
	white-space: pre-wrap;

	&:empty {
		&:before {
			content: attr(placeholder);
			position: absolute;
			color: rgba(55, 53, 47, 0.5);
		}
	}
`;

export default function StandardEditable(props) {
  const {
    anchor,
    placeholder,
    blockId,
    content,
    onChange,
    onKeyDown,
    onFocus,
    onBlur,
  } = props;

  return (
    <Editable
      data-anchor={anchor}
      data-block-id={blockId}
      contentEditable
      placeholder={placeholder}
      suppressContentEditableWarning
      spellCheck={false}
      onInput={onChange}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {content}
    </Editable>
  );
}

StandardEditable.defaultProps = {
  anchor: false,
  placeholder: '',
  content: '',
};

StandardEditable.propTypes = {
  anchor: PropTypes.bool,
  placeholder: PropTypes.string,
  blockId: PropTypes.string.isRequired,
  content: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};
