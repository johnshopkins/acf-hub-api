import PropTypes from 'prop-types';

import FormField from './FormField';

class Hidden extends FormField {
  getField() {
    return <input
      type={'hidden'}
      id={this.props.id}
      name={this.props.name}
      ref={this.formFieldRef}
      value={this.props.value || ''}
      data-testid={'hidden'}
    />;
  }

  getFieldLabel() {
    return null;
  }
}

Hidden.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string, // 'true' on init
    PropTypes.bool,   // true after changes
  ])
};

export default Hidden;
