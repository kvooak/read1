import React, { useEffect, useState } from 'react';

import './DataManagementScreen.css';

import Container from 'react-bootstrap/Container';

import CategoryTable from './CategoryTable';

import managementData from './data.json';
// import materialGroups from './material_groups.json';

export default function DataManagementScreen() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setCategories(managementData.map((item) => {
      if (categories.indexOf(item.category) === -1) {
        return item.category;
      }
      return null;
    }));

    setCategories((prev) => prev.filter((value, index, arr) => arr.indexOf(value) === index));
  }, [managementData]);

  return (
    <Container className="container" fluid>
      <h1>Data Management</h1>
      {categories?.map((category) => (
        <CategoryTable
          key={category.category}
          category={category}
        />
      ))}
    </Container>
  );
}
