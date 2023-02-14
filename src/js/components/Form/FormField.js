import { Component, createRef } from '@wordpress/element';
import { VisuallyHidden } from '@wordpress/components';
import PropTypes from 'prop-types';

class FormField extends Component {

  constructor(props) {

    super(props);

    this.formFieldRef = createRef();
    this.onChange = this.onChange.bind(this);

    // @todo why was this here?
    // props.onChange();

  }

  onChange() {
    this.props.onChange(this.props.label, this.formFieldRef.current.value);
  }

  getFieldLabel() {
    return (
      <VisuallyHidden>
        <label htmlFor={this.props.id}>{this.props.label}</label>
      </VisuallyHidden>
    );
  }

  render() {
    const classes = ['container', this.props.label.toLowerCase()];
    return (
      <div className={classes.join(' ')}>
        {this.getFieldLabel()}
        {this.getField()}
      </div>
    );
  };

};

FormField.propTypes = {
  onChange: PropTypes.func,
};

export default FormField;
