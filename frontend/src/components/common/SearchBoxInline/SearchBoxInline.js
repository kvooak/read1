/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';
import PropTypes from 'prop-types';

import './SearchBoxInline.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons/';

function SearchBoxInline(props) {
  const { onBlur } = props;

  return (
    <div className="search-box-wrapper">
      <div className="search-box-wrapper-inner">
        <span className="search-icon">
          <FontAwesomeIcon className="feature-icon" icon={faSearch} />
        </span>
        <input
          autoFocus
          onBlur={onBlur}
          className="search-input"
          placeholder="Type to search..."
          type="text"
        />
      </div>
    </div>
  );
}

SearchBoxInline.propTypes = {
  onBlur: PropTypes.func.isRequired,
};

export default SearchBoxInline;
