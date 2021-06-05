/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';

import striptags from 'striptags';

import useDebounce from '../_custom/Code/useDebounce';

import EmoContainer from '../_custom/UI/Container';
import EmoEditableDiv from '../_custom/UI/EmoEditableDiv';

const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const ColumnSeparator = styled.div`
  width: 20px;
`;

export default function DocumentScreen() {
  const inputRef = useRef();
  const outputRef = useRef();
  const [input, setInput] = useState();
  const [output, setOutput] = useState();

  const debouncedInput = useDebounce(input, 300);
  useEffect(() => {
    outputRef.current.innerHTML = debouncedInput || '';
  }, [debouncedInput]);

  const debouncedOutput = useDebounce(output, 300);
  useEffect(() => {
    console.log(debouncedOutput);
  }, [debouncedOutput]);

  const handlePaste = (e) => {
    const data = e.clipboardData.getData('text/plain');
    e.target.innerHTML = data;
  };

  const handleInput = (e) => {
    const data = e.target.innerHTML;
    const stripped = striptags(data);
    e.target.innerHTML = stripped;
    setInput(stripped);
  };

  useEffect(() => {
    const selection = window.getSelection();
    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(inputRef.current);
    range.collapse(false);
    selection.addRange(range);
    inputRef.current.focus();
  }, [input]);

  const handleOutputChange = (e) => {
    const data = e.target.innerHTML;
    const stripped = striptags(data);
    e.target.innerHTML = stripped;
    setOutput(stripped);
  };

  return (
    <EmoContainer>
      <RowWrapper>
        <EmoEditableDiv
          ref={inputRef}
          onInput={handleInput}
          onPaste={handlePaste}
        />
        <ColumnSeparator />
        <EmoEditableDiv
          ref={outputRef}
          onInput={handleOutputChange}
          onPaste={handlePaste}
        />
      </RowWrapper>
    </EmoContainer>
  );
}
