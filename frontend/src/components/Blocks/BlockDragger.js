import React from 'react';
import { DragSource } from 'react-dnd';

const handleStyle = {
  backgroundColor: 'green',
  width: '1rem',
  height: '1rem',
  display: 'inline-block',
  marginRight: '0.75rem',
  cursor: 'move',
};

export const BlockWithHandle = ({ children, ...props }) => {
  const handle = <div style={handleStyle} />;
  const [block] = children;
  const { isDragging, connectDragSource, connectDragPreview } = props;
  return connectDragPreview(
    <>
      {connectDragSource(handle)}
      {block}
    </>,
  );
};

const BlockDragger = DragSource(
  'block',
  {
    beginDrag: () => ({}),
  },
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  }),
)(BlockWithHandle);

export default BlockDragger;
