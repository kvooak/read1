/* eslint-disable max-len */
import React from 'react';

import './Filter.css';

function FilterInterface() {
  return (
    <div className="feature-interface-wrapper">
      <div className="scroller-box-wrapper">
        <div>
          <div className="scroller-box-vertical">
            test
          </div>
        </div>
      </div>

      <div className="feature-add-wrapper">
        <div className="feature-add-button-wrapper" role="button" aria-disabled="false" tabIndex="0">
          <div className="feature-add-button-style-wrapper">
            <div className="feature-add-icon-wrapper">
              <div className="feature-add-icon">
                {/* <svg viewBox="0 0 16 16" className="plus" style="width: 100%; height: 100%; display: block; fill: rgb(46, 170, 220); flex-shrink: 0; backface-visibility: hidden;">
                  <path d="M7.977 14.963c.407 0 .747-.324.747-.723V8.72h5.362c.399 0 .74-.34.74-.747a.746.746 0 00-.74-.738H8.724V1.706c0-.398-.34-.722-.747-.722a.732.732 0 00-.739.722v5.529h-5.37a.746.746 0 00-.74.738c0 .407.341.747.74.747h5.37v5.52c0 .399.332.723.739.723z" />
                </svg> */}
              </div>
            </div>
            <div className="feature-add-text-wrapper">
              <div className="feature-add-text-wrapper-inner">
                <div className="feature-add-text">
                  <div>
                    Add a filter
                    {/* <svg viewBox="0 0 30 30" className="chevronDown" style="width: 10px; height: 100%; display: inline; fill: inherit; flex-shrink: 0; backface-visibility: hidden; margin-left: 6px;">
                      <polygon points="15,17.4 4.8,7 2,9.8 15,23 28,9.8 25.2,7 " />
                    </svg> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterInterface;
