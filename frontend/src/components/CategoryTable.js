/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import PropTypes from 'prop-types';

import CategoryTableHeaderRow from './CategoryTableHeaderRow';
import CategorySnippetRow from './CategorySnippetRow';
import { capitalizeFirstLetter } from '../widgets/utilities';

export default function CategoryTable(props) {
  const { category } = props;
  const { name, data } = category;

  return (
    <div className="category-table">
      <h4>{capitalizeFirstLetter(name)}</h4>
      <div>
        <CategoryTableHeaderRow data={data} />
        {data.map((snippet) => <CategorySnippetRow key={snippet.id} snippet={snippet} />)}
      </div>
    </div>
  );
}

CategoryTable.propTypes = {
  category: PropTypes.instanceOf(Object).isRequired,
};
