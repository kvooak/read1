import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const EditableWrapper = styled.div`
	height: 100%;
	display: flex;
`;

const Editable = styled.div`
	padding: 6px 8px 8px 8px;
	line-height: 1.4rem;
	min-width: 0;
	width: 100%;
	height: 100%;
	outline: none;
	word-spacing: 0.05rem;
	text-indent: 0px;
	text-shadow: none;
	text-align: start;
	cursor: text;
	overflow-wrap: break-word;
	white-space: pre-wrap;
	-webkit-writing-mode: horizontal-tb !important;
	-webkit-animation-duration: 10ms;
  animation-duration: 10ms;
	font-family: -apple-system,
		BlinkMacSystemFont,
		"Segoe UI",
		Roboto,
		"Helvetica Neue",
		Arial,
		sans-serif,
		"Apple Color Emoji",
		"Segoe UI Emoji",
		"Segoe UI Symbol";
`;

export default function StandardEditable(props) {
  const {
    anchor,
    name,
    blockId,
    content,
    onChange,
    onKeyDown,
  } = props;

  const wrapperId = `editable-wrapper-${blockId}`;
  const editableId = `editable-${blockId}`;

  const [proxyEvent, setProxyEvent] = useState();
  const [buffer, setBuffer] = useState(content);
  const handleChange = (event) => {
    setProxyEvent(event);
    setBuffer(event.target.innerHTML);
  };

  useEffect(() => {
    if (proxyEvent) onChange(proxyEvent);
  }, [proxyEvent]);

  return (
    <EditableWrapper id={wrapperId}>
      <Editable
        id={editableId}
        data-anchor={anchor}
        data-name={name}
        data-content={buffer}
        data-block-id={blockId}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        onInput={handleChange}
        onBlur={handleChange}
        onKeyDown={onKeyDown}
      >
        {content}
      </Editable>
    </EditableWrapper>
  );
}

StandardEditable.defaultProps = {
  anchor: false,
  content: '',
};

StandardEditable.propTypes = {
  anchor: PropTypes.bool,
  name: PropTypes.string.isRequired,
  blockId: PropTypes.string.isRequired,
  content: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
};
