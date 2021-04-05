import React, { useState } from 'react';

import './TopControlBar.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons/';

import SearchBoxInline from '../common/SearchBoxInline/SearchBoxInline';
import FeatureButton from '../common/FeatureButton/FeatureButton';
import FeatureWrapper from './Features/FeatureWrapper';
import FilterInterface from './Features/Filter/Filter';

function TopControlBar() {
  const [expandFilterBox, setExpandFilterBox] = useState(false);
  const [expandSearchBox, setExpandSearchBox] = useState(false);

  const handleExpandFilterBox = () => {
    setExpandFilterBox((prev) => !prev);
  };

  const handleExpandSearchBox = () => {
    setExpandSearchBox((prev) => !prev);
  };

  return (
    <div className="table-top-control-bar-wrapper">
      <div className="feature-buttons-group-wrapper">
        <FeatureButton featureName="Properties" />
        <FeatureButton
          onClick={handleExpandFilterBox}
          featureName="Filter"
        />
        <FeatureButton featureName="Sort" />

        {expandSearchBox
          ? <SearchBoxInline onBlur={handleExpandSearchBox} />
          : (
            <FeatureButton
              onClick={handleExpandSearchBox}
              featureIcon={
                <FontAwesomeIcon className="feature-icon" icon={faSearch} />
              }
              featureName="Search"
            />
          )}

        {!expandFilterBox && (
          <FeatureWrapper
            featureName="Filters"
            featureTarget="Default view"
          >
            <FilterInterface />
          </FeatureWrapper>
        )}
      </div>
    </div>
  );
}

export default TopControlBar;
