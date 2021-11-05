import React from 'react';
import styled from '@emotion/styled';

const DocumentCellDiv = styled.div`
  display: inline-block;
  resize: none;
  width: 100%;
  -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
            box-sizing: border-box;
  font-size: inherit;
  font-family: inherit;
  border: 1px solid rgba(55, 53, 47, 0.1);
  border-left: none;
  outline: none;
  user-select: text;
    -webkit-user-select: text;
  transition: background 20ms ease-in 0.01s;
  cursor: pointer;
  align-items: top left;
  padding: 4px 8px 4px;
  overflow: auto;
  color: rgb(55, 53, 47);
  &::placeholder {
    color: rgba(55, 53, 47, 0.4);
    font-weight: 500;
  }
  &:hover,
  &:focus {
    background: rgba(55, 53, 47, 0.04);
  }
`;

function DocumentCell(props) {
  const {
    cellId,
    cellKey,
    cellValue,
    onChange,
  } = props;

  return (
    <DocumentCellDiv
      contentEditable
      id={cellId}
      key={cellKey}
      onInput={onChange}
      onBlur={onChange}
    >
      {cellValue}
    </DocumentCellDiv>
  );
}

export default DocumentCell;
