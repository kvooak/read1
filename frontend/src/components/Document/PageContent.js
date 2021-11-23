import React, {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import BlockUtils from './functions/BlockUtils';
import TextBlock from '../Blocks/TextBlock';

const PageContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`;

export default function PageContent(props) {
  const { blocks, onChange } = props;
  const [anchors, setAnchors] = useState([]);
  useEffect(() => {
    setAnchors(document.querySelectorAll('[data-anchor="true"]'));
  }, [blocks]);

  const handleMoveCursorUp = (currentIndex) => {
    const cursorIndex = currentIndex - 1;
    const targetBlock = anchors[cursorIndex];
    BlockUtils.focusBlock(targetBlock);
  };

  return (
    <PageContentWrapper>
      {blocks.map((block) => (
        <TextBlock
          key={block.id}
          block={block}
          onChange={onChange}
          moveCursorUp={handleMoveCursorUp}
        />
      ))}
    </PageContentWrapper>
  );
}

PageContent.propTypes = {
  blocks: PropTypes.instanceOf(Array).isRequired,
  onChange: PropTypes.func.isRequired,
};
