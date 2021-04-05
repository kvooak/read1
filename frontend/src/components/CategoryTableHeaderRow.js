import React from 'react';

import './CategoryTableHeaderRow.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAlignLeft,
  faFont,
} from '@fortawesome/free-solid-svg-icons/';

// import { propertyTypeCheck } from './TableView/helpers/propertyTypeCheck';

export default function CategoryTableHeaderRow() {
  return (
    <div className="table-header">
      <div className="table-header-inner-wrap">
        <div className="table-header-cell-wrap id">
          <div
            className="table-header-cell"
            role="button"
            aria-disabled="false"
            tabIndex="0"
          >
            <div className="table-header-cell-title">
              <div className="table-header-cell-title-icon-wrap">
                <FontAwesomeIcon className="table-header-cell-title-icon" icon={faAlignLeft} />
              </div>
              <div className="table-header-cell-title-text">Key</div>
            </div>
          </div>
        </div>

        <div className="table-header-cell-wrap content">
          <div
            className="table-header-cell"
            role="button"
            aria-disabled="false"
            tabIndex="0"
          >
            <div className="table-header-cell-title">
              <div className="table-header-cell-title-icon-wrap">
                <FontAwesomeIcon className="table-header-cell-title-icon" icon={faFont} />
              </div>
              <div className="table-header-cell-title-text">Content</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
