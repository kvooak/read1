/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';

import './DataManagementScreen.css';

import Container from 'react-bootstrap/Container';

import CategoryTable from './CategoryTable';

import managementData from './data.json';
// import materialGroups from './material_groups.json';

export default function DataManagementScreen() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let categoryNameList = managementData.map((item) => {
      if (categories.indexOf(item.category) === -1) {
        return item.category;
      }
      return null;
    });

    categoryNameList = categoryNameList.filter((value, index, arr) => arr.indexOf(value) === index);
    const _categories = categoryNameList.map((category) => (
      {
        name: category,
        data: managementData.filter((item) => item.category === category),
      }
    ));

    setCategories(_categories);
  }, [managementData]);

  return (
    <Container fluid>
      <h1>Data Management</h1>
      {categories?.map((category) => (
        <CategoryTable
          key={category.name}
          category={category}
        />
      ))}
    </Container>
  );
}
