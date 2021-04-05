/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import PropTypes from 'prop-types';

import './CategoryTable.css';

import CategorySnippetRow from './CategorySnippetRow';

export default function CategoryTable(props) {
  const { category } = props;
  const { name, data } = category;

  return (
    <div className="database-table-wrapper">
      <div className="database-table">
        {data.map((snippet) => (
          <CategorySnippetRow
            key={snippet.id}
            category={name}
            snippet={snippet}
          />
        ))}
      </div>
    </div>
  );
}

CategoryTable.propTypes = {
  category: PropTypes.instanceOf(Object).isRequired,
};
