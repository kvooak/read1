import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import BlockControl from './functions/BlockControl';
import TextBlock from '../Blocks/TextBlock';

const PageContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`;

export default function PageContent(props) {
  const {
    blocks, onChange, onReadUpKeyCommand, onReadDownKeyCommand,
  } = props;

  const [focused, setFocused] = useState(null);
  useEffect(() => {
    if (focused) BlockControl.focusBlock(focused.firstChild);
  }, [focused]);

  const [refs, setRefs] = useState([]);
  const handleRegisterRef = (ref) => {
    setRefs((prev) => [...prev, ref]);
    setFocused(ref);
  };

  const handleDeregisterRef = (blockID) => {
    const index = refs.findIndex((ref) => ref.id === blockID);
    setFocused(refs[index - 1]);
    setRefs((prev) => {
      const current = [...prev];
      current.splice(index, 1);
      return current;
    });
  };

  return (
    <PageContentWrapper>
      {blocks.map((block) => (
        <TextBlock
          key={block.id}
          block={block}
          onChange={onChange}
          onMount={handleRegisterRef}
          onUnmount={handleDeregisterRef}
          onReadDownKeyCommand={onReadDownKeyCommand}
          onReadUpKeyCommand={onReadUpKeyCommand}
        />
      ))}
    </PageContentWrapper>
  );
}

PageContent.propTypes = {
  blocks: PropTypes.instanceOf(Array).isRequired,
  onChange: PropTypes.func.isRequired,
  onReadDownKeyCommand: PropTypes.func.isRequired,
  onReadUpKeyCommand: PropTypes.func.isRequired,
};
