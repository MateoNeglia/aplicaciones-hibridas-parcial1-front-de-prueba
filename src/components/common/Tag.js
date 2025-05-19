import React from 'react';
import './Tag.scss';

const Tag = ({ label, onRemove }) => {
  return (
    <span className="tag">
      {label}
      {onRemove && (
        <button className="tag-remove" onClick={onRemove}>
          &times;
        </button>
      )}
    </span>
  );
};

export default Tag;