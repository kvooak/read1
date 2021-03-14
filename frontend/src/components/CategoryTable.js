/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import PropTypes from 'prop-types';

import Table from 'react-bootstrap/Table';

import { capitalizeFirstLetter } from '../widgets/utilities';

function CategorySnippetRow(props) {
  const { snippet } = props;

  const {
    id,
    content,
    effect,
    for_material_groups,
    country_code,
    timestamp,
  } = snippet;

  return (
    <tr>
      <td>{id.slice(-5)}</td>
      <td>{content}</td>
      <td>{effect}</td>
      <td className="col">
        {for_material_groups.map((mat) => (
          <td className="row" key={mat}>{mat}</td>
        ))}
      </td>
      <td>{country_code}</td>
      <td>{timestamp}</td>
    </tr>
  );
}

CategorySnippetRow.propTypes = {
  snippet: PropTypes.instanceOf(Object).isRequired,
};

export default function CategoryTable(props) {
  const { category } = props;
  const { name, data } = category;

  const tableStyle = {
    columnWidth: {
      id: {
        width: '2%',
        maxWidth: '2%',
        wordBreak: 'break-all',
      },
      content: {
        width: '30%',
        maxWidth: '30%',
        wordBreak: 'break-all',
      },
      effect: {
        width: '5%',
        maxWidth: '5%',
        wordBreak: 'break-all',
      },
      materialGroups: {
        width: '20%',
        maxWidth: '20%',
        wordBreak: 'break-all',
      },
      countryCode: {
        width: '5%',
        maxWidth: '5%',
        wordBreak: 'break-all',
      },
      dateModified: {
        width: '10%',
        maxWidth: '10%',
        wordBreak: 'break-all',
      },
    },
  };

  return (
    <div className="category-table">
      <h4>{capitalizeFirstLetter(name)}</h4>
      <Table bordered size="sm" responsive>
        <thead>
          <tr>
            <th style={tableStyle.columnWidth.id}>ID</th>
            <th style={tableStyle.columnWidth.content}>Content</th>
            <th style={tableStyle.columnWidth.effect}>Effect</th>
            <th style={tableStyle.columnWidth.materialGroups}>Material Groups</th>
            <th style={tableStyle.columnWidth.countryCode}>Country Code</th>
            <th style={tableStyle.columnWidth.dateModified}>Date Modified</th>
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
