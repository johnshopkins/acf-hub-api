import PropTypes from 'prop-types';
import FormField from './FormField';

class Select extends FormField {
  getField() {
    const emptyLabel = '- ' + this.props.label + ' -';

    return (
      <select
        id={this.props.id}
        name={this.props.name}
        onChange={this.onChange}
        ref={this.formFieldRef}
        value={this.props.value}
      >
        <option key={0} value={''}>{emptyLabel}</option>
        {this.props.options.map((option, i) => <option key={i} value={option}>{option}</option>)}
      </select>
    );
  }
}

Select.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string
};

export default Select
