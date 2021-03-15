import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpandAlt } from '@fortawesome/free-solid-svg-icons/';

import Button from 'react-bootstrap/Button';

import './OpenAsModalButton.css';

export default function OpenAsModalButton() {
  return (
    <Button size="sm" className="open-as-modal-button">
      <FontAwesomeIcon icon={faExpandAlt} />
      {' '}
      Open
    </Button>
  );
}
