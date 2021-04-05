/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/style-prop-object */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import { generatePath, Link } from 'react-router-dom';

import './CountrySnippetRow.css';

import Badge from 'react-bootstrap/Badge';

import OpenAsModalButton from './common/OpenAsModalButton';
import { timeConverter } from '../widgets/utilities';

function SnippetEffectBadge(value) {
  if (value === 1) {
    return (
      <Badge className="snippet-effect-badge-good">{value}</Badge>
    );
  } if (value === 0.5) {
    return (
      <Badge className="snippet-effect-badge-neutral">{value}</Badge>
    );
  }

  return (
    <Badge className="snippet-effect-badge-bad">{value}</Badge>
  );
}

function MaterialGroupTag(name) {
  return (
    <Badge className="material-group-badge">{name}</Badge>
  );
}

function CategoryTag(name) {
  return (
    <Badge className="category-badge">{name}</Badge>
  );
}

export default function CategorySnippetRow(props) {
  const { category, snippet } = props;
  const {
    id,
    content,
    ...rest
  } = snippet;

  const {
    effect,
    for_material_groups,
    country_code,
    timestamp,
  } = rest;

  const [contentEditable, setContentEditable] = useState(false);
  const [contentDivClassName, setContentDivClassName] = useState('content-inner');
  const [showOpenAsModalButton, setShowOpenAsModalButton] = useState(false);

  const handleContentMouseEnter = () => {
    setShowOpenAsModalButton(true);
  };

  const handleContentMouseLeave = () => {
    setShowOpenAsModalButton(false);
  };

  const handleContentOnClick = () => {
    setContentEditable(true);
    setShowOpenAsModalButton(false);
    setContentDivClassName('content-inner-focused');
  };

  const handleContentOnBlur = () => {
    setContentEditable(false);
    setContentDivClassName('content-inner');
  };

  // const detailPath = generatePath('/snippet-:id', {
  //   id,a
  // });

  return (
    <div className="table-row">
      <div className="table-cell id">
        {CategoryTag(category)}
        <div className="px-1 pb-3">{id.slice(-5)}</div>
      </div>

      <div
        aria-hidden="true"
        className="table-cell content"
        onMouseEnter={handleContentMouseEnter}
        onMouseLeave={handleContentMouseLeave}
      >
        {showOpenAsModalButton && <OpenAsModalButton />}
        <div
          aria-hidden="true"
          onMouseDown={handleContentOnClick}
          onBlur={handleContentOnBlur}
          contentEditable={contentEditable}
          id={id}
          className={contentDivClassName}
        >
          {content}
        </div>
      </div>
      <div className="table-cell">
        <div className="px-2 pt-2 pb-2">{SnippetEffectBadge(effect)}</div>
      </div>
      <div className="table-cell">
        <div className="px-2 pt-2 pb-2">
          {for_material_groups.map((material) => (
            <div key={material}>
              {MaterialGroupTag(material)}
            </div>
          ))}
        </div>
      </div>
      <div className="table-cell">
        <div className="px-2 pt-2 pb-2">{country_code}</div>
      </div>
      <div className="table-cell">
        <div className="px-2 pt-2 pb-2">{timeConverter(timestamp, 'compactTime')}</div>
      </div>
    </div>
  );
}

CategorySnippetRow.propTypes = {
  category: PropTypes.string.isRequired,
  snippet: PropTypes.instanceOf(Object).isRequired,
};
