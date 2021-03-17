/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import PropTypes from 'prop-types';

import './CategoryTable.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFont } from '@fortawesome/free-solid-svg-icons/';

import CategorySnippetRow from './CategorySnippetRow';
import { capitalizeFirstLetter } from '../widgets/utilities';

export default function CategoryTable(props) {
  const { category } = props;
  const { name, data } = category;

  return (
    <div className="category-table">
      <h4>{capitalizeFirstLetter(name)}</h4>
      <div>
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
                    <FontAwesomeIcon className="table-header-cell-title-icon" icon={faFont} />
                  </div>
                  <div className="table-header-cell-title-text">Key</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {data.map((snippet) => <CategorySnippetRow key={snippet.id} snippet={snippet} />)}
      </div>
    </div>
  );
}

CategoryTable.propTypes = {
  category: PropTypes.instanceOf(Object).isRequired,
};
