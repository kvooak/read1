import React from 'react';

import { Spinner } from 'spin.js';

const opts = {
  lines: 8, // The number of lines to draw
  length: 22, // The length of each line
  width: 17, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 0.2, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  // animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: 'gray', // CSS color or array of colors
  fadeColor: 'white', // CSS color or array of colors
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  zIndex: 2000000000, // The z-index (defaults to 2e9)
  className: 'spinner', // The CSS class to assign to the spinner
  position: 'absolute', // Element positioning
};

function Loader() {
  const target = document.getElementById('spinner');
  // eslint-disable-next-line no-unused-vars
  const spinner = new Spinner(opts).spin(target);

  return (
    <div id="spinner" className="spinner" />
  );
}

export default Loader;
