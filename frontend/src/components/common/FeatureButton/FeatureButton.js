/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';

import './FeatureButton.css';

function FeatureButton(props) {
  const { featureName, featureIcon, onClick } = props;
  return (
    <div
      className="feature-button"
      tabIndex="0"
      role="button"
      onClick={onClick}
    >
      {featureIcon.props.icon && <span className="feature-icon">{featureIcon}</span>}

      {featureName}
    </div>
  );
}

FeatureButton.defaultProps = {
  featureIcon: <></>,
  onClick: () => {},
};

FeatureButton.propTypes = {
  onClick: PropTypes.func,
  featureIcon: PropTypes.instanceOf(Object),
  featureName: PropTypes.string.isRequired,
};

export default FeatureButton;
