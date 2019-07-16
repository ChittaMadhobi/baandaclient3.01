import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const TextAreaFieldGroup = ({
  style,
  name,
  placeholder,
  value,
  error,
  info,
  must,
  rows,
  onChange
}) => {
  return (
    <div className="form-group">
      <textarea
        className={classnames('form-control form-control-sm', {
          'is-invalid': error
        })}
        placeholder={placeholder}
        // style={{color: style}}
        style={style}
        name={name}
        value={value}
        rows={rows}
        spellCheck={rows}
        onChange={onChange}
      />
      {info && (
        // <small className="form-text text-muted">
        <small className="form-text">
          {info}
          {must}
        </small>
      )}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

TextAreaFieldGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  rows: PropTypes.number,
  onChange: PropTypes.func.isRequired
};

export default TextAreaFieldGroup;
