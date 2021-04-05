import React from 'react';
import PropTypes from 'prop-types';

import './FeatureWrapper.css';

function FeatureWrapper(props) {
  const { featureName, featureTarget, children } = props;

  return (
    <div className="feature-box-layout-wrapper">
      <div className="feature-box-position-wrapper">
        <div className="feature-box-inner-wrapper">
          <div className="feature-box-border-wrapper">
            <div className="feature-box-content-wrapper">
              <div className="feature-box-title-wrapper">
                <div className="feature-box-title-wrapper-inner">
                  <div className="feature-box-title-style-wrapper">
                    <div className="feature-box-title-style-wrapper-2">
                      <div className="feature-box-title-text-box">
                        &nbsp;
                        <div className="feature-box-title-text">
                          {featureName}
                          {' '}
                          for
                          <span className="feature-box-target-name">
                            {featureTarget}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

FeatureWrapper.propTypes = {
  children: PropTypes.instanceOf(Object).isRequired,
  featureName: PropTypes.string.isRequired,
  featureTarget: PropTypes.string.isRequired,
};

export default FeatureWrapper;
