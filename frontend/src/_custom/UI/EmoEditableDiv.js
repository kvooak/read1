/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const EmoEditableDiv = React.forwardRef((props, ref) => {
  console.log();
  return (
    <div
      {...props}
      ref={ref}
      contentEditable
      css={css`
        display: inline-block;
        min-height: 30px;
        max-height: 240px;
        width: 100%;
        -webkit-box-sizing: border-box;
              -moz-box-sizing: border-box;
                  box-sizing: border-box;
        font-size: inherit;
        font-family: inherit;
        border: 1px solid rgba(55, 53, 47, 0.1);
        outline: none;
        user-select: text;
          -webkit-user-select: text;
        transition: background 20ms ease-in 0.01s;
        cursor: pointer;
        align-items: top left;
        border-radius: 4px;
        padding: 4px 8px 4px;
        overflow-y: visible;
        color: rgb(55, 53, 47);
        &::placeholder {
          color: rgba(55, 53, 47, 0.4);
          font-weight: 500;
        }
        &:hover,
        &:focus {
          background: rgba(55, 53, 47, 0.04);
        }
      `}
    />
  );
});

export default EmoEditableDiv;
