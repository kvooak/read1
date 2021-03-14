/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

import Table from 'react-bootstrap/Table';

import { capitalizeFirstLetter } from '../widgets/utilities';

export default function CategoryTable(category) {
  const name = capitalizeFirstLetter(category.category);

  return (
    <div className="category-table">
      <h4>{name}</h4>
      <Table bordered size="sm">
        <thead>
          <tr>
            <th />
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <td>3</td>
            <td colSpan="2">Larry the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

// CategoryTable.propTypes = {
//   category: PropTypes.instanceOf(Object).isRequired,
// };
