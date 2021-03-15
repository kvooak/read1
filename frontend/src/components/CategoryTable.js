/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import PropTypes from 'prop-types';

import './CategoryTable.css';

import Table from 'react-bootstrap/Table';

import CategorySnippetRow from './CategorySnippetRow';

import {
  tableHeaders,
  tableStyle,
} from './CategoryTableConstants';

import { capitalizeFirstLetter } from '../widgets/utilities';

export default function CategoryTable(props) {
  const { category } = props;
  const { name, data } = category;

  return (
    <div className="category-table">
      <h4>{capitalizeFirstLetter(name)}</h4>
      <Table size="sm" responsive>
        <thead>
          <tr>
            {tableHeaders.map((col) => (
              <th key={col.styleID} style={tableStyle.columnWidth[col.styleID]}>
                <span className="mx-2">{col.title}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((snippet) => <CategorySnippetRow key={snippet.id} snippet={snippet} />)}
        </tbody>
      </Table>
    </div>
  );
}

CategoryTable.propTypes = {
  category: PropTypes.instanceOf(Object).isRequired,
};
