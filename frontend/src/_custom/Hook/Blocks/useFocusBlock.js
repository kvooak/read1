import { useState, useEffect } from 'react';
import BlockControl from '../../../components/Document/functions/BlockControl';

const useFocusBlock = (cursor) => {
  const [block, setBlock] = useState(null);
  const { focusBlock } = BlockControl;
  useEffect(() => {
    let target;
    if (cursor) {
      target = cursor.querySelector('.editable');
      setBlock(target);
      focusBlock(target);
    }
    return () => {
      target = undefined;
    };
  }, [cursor]);
  return block;
};

export default useFocusBlock;
