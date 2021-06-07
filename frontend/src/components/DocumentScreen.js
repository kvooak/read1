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

export default function DocumentScreen() {
  const inputRef = useRef();
  const outputRef = useRef();
  const [input, setInput] = useState();
  const [output, setOutput] = useState();
  const [inputPasteEvent, setInputPasteEvent] = useState(false);
  const [outputPasteEvent, setOutputPasteEvent] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener('paste', () => {
        setInputPasteEvent(true);
      });
    }
  }, [inputRef]);

  useEffect(() => {
    if (outputRef.current && !outputPasteEvent) {
      outputRef.current.addEventListener('paste', () => {
        setOutputPasteEvent(true);
      });
    }
  }, [outputRef]);

  const debouncedInput = useDebounce(input, 300);
  useEffect(() => {
    outputRef.current.innerHTML = debouncedInput || '';
  }, [debouncedInput]);

  const debouncedOutput = useDebounce(output, 300);
  useEffect(() => {
    console.log(debouncedOutput);
  }, [debouncedOutput]);

  const handleInputPaste = (e) => {
    // stop data from actually being pasted
    e.stopPropagation();
    e.preventDefault();

    const data = e.clipboardData.getData('text/plain');
    const stripped = striptags(data);
    e.target.innerHTML += stripped;
    setInput(e.target.innerHTML);
    setInputPasteEvent(false);
  };

  const handleOutputPaste = (e) => {
    // stop data from actually being pasted
    e.stopPropagation();
    e.preventDefault();

    const data = e.clipboardData.getData('text/plain');
    const stripped = striptags(data, ['br']);
    e.target.innerHTML += stripped;
    setOutput(e.target.innerHTML);
    setOutputPasteEvent(false);
  };

  const handleInput = (e) => {
    if (inputPasteEvent) {
      return false;
    }
    const data = e.target.innerHTML;
    const stripped = striptags(data, ['br']);
    e.target.innerHTML = stripped;
    setInput(stripped);
    return true;
  };

  const handleOutputChange = (e) => {
    if (outputPasteEvent) {
      return false;
    }
    const data = e.target.innerHTML;
    const stripped = striptags(data, ['br']);
    e.target.innerHTML = stripped;
    setOutput(stripped);
    return true;
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

  useEffect(() => {
    const selection = window.getSelection();
    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(outputRef.current);
    range.collapse(false);
    selection.addRange(range);
    outputRef.current.focus();
  }, [output]);

  return (
    <EmoContainer>
      <RowWrapper>
        <EmoEditableDiv
          ref={inputRef}
          onInput={handleInput}
          onPaste={handleInputPaste}
        />

        <EmoEditableDiv
          ref={outputRef}
          onInput={handleOutputChange}
          onPaste={handleOutputPaste}
        />
      </RowWrapper>
    </EmoContainer>
  );
}
