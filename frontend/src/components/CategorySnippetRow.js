/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/style-prop-object */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import { generatePath, Link } from 'react-router-dom';

import './CountrySnippetRow.css';

import Badge from 'react-bootstrap/Badge';

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

export default function CategorySnippetRow(props) {
  const { snippet } = props;
  const {
    id,
    content,
    effect,
    for_material_groups,
    country_code,
    timestamp,
  } = snippet;

  const [contentEditable, setContentEditable] = useState(false);
  const [contentDivClassName, setContentDivClassName] = useState('content-div');

  const handleContentMouseEnter = () => {
  };

  const handleContentMouseLeave = () => {
  };

  const handleContentOnClick = () => {
    setContentEditable(true);
    setContentDivClassName('content-div-focused');
  };

  const handleContentOnBlur = () => {
    setContentEditable(false);
    setContentDivClassName('content-div');
  };

  // const detailPath = generatePath('/snippet-:id', {
  //   id,a
  // });

  return (
    <tr>
      <td className="id"><span className="px-2 pt-2 pb-3">{id.slice(-5)}</span></td>
      <td className="content">
        <div
          aria-hidden="true"
          onMouseEnter={handleContentMouseEnter}
          onMouseLeave={handleContentMouseLeave}
          onMouseDown={handleContentOnClick}
          onBlur={handleContentOnBlur}
          contentEditable={contentEditable}
          id={id}
          className={contentDivClassName}
        >
          {content}
        </div>
      </td>
      <td><div className="px-2 pb-2">{SnippetEffectBadge(effect)}</div></td>
      <td>
        <div className="px-2 pb-2">
          {for_material_groups.map((material) => (
            <div key={material}>
              {MaterialGroupTag(material)}
            </div>
          ))}
        </div>
      </td>
      <td><div className="px-2 pb-2">{country_code}</div></td>
      <td><span className="px-2 pb-2">{timeConverter(timestamp)}</span></td>
    </tr>
  );
}

CategorySnippetRow.propTypes = {
  snippet: PropTypes.instanceOf(Object).isRequired,
};
