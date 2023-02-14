import PropTypes from 'prop-types';
import FormField from './FormField';

class Number extends FormField {
  getField() {
    return <input
      type={'number'}
      id={this.props.id}
      name={this.props.name}
      placeholder={this.props.label}
      onChange={this.onChange}
      ref={this.formFieldRef}
      value={this.props.value || ''}
    />;
  }
}

Number.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  // value: PropTypes.oneOfType([
  //   PropTypes.string, // when empty
  //   PropTypes.number,
  // ])
};

export default Number;
