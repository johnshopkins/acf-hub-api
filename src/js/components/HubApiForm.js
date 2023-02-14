import { Component } from '@wordpress/element';
import PropTypes from 'prop-types';

// importing entire lib instead of 'lodash/debounce' because wordpress only
// includes 'lodash' in build/index.asset.php if the entire lib is imported
import _ from 'lodash';

import FormComponents from './Form';
import Preview from './Preview';
import API from '../helpers/api';

import '../../css/form.scss';

class HubApiForm extends Component {

  constructor(props) {
    super(props);

    this.api = new API(props.auth, props.useFetch);

    this.state = {
      fields: {},
      data: null,
      initialized: false, // does the field have a value yet
      loading: true,
    };

    props.fields.map(field => {
      this.state.fields[field.props.label.toLowerCase()] = field.props.value;
    });

    // delay fetching new data to allow use to finish their input
    this.delayFetchData = _.debounce(() => this.fetchData(), 500);

    this.onChange = this.onChange.bind(this);
  }

  fetchData() {
    this.setState({ loading: true });

    this.api.get(this.state.fields, this.props.allowPreview, (data) => {
      this.setState((state) => {

        state.fields.valid = data && !data.error;

        if (!state.initialized && state.fields.valid) {
          // use this to figure out if an invalid icon should be shown
          // if/when the field is returned to no value
          state.initialized = true;
        }

        state.data = data;
        state.loading = false;

        return state;
      });
    });
  }

  onChange(field, newValue) {
    this.setState((state) => {
      state.fields[field.toLowerCase()] = newValue;
      return state;
    });

    this.delayFetchData();
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    return (
      <>
        {this.props.fields.map((field, i) => {
          if (!field.props) {
            return null;
          }
          const TagName = field.type;
          const Tag = FormComponents[TagName];
          let props = field.props;
          props.key = i;
          props.onChange = this.onChange;
          props.value = this.state.fields[field.props.label.toLowerCase()];
          return <Tag {...props} />;
        })}
        <Preview
          data={this.state.data}
          initialized={this.state.initialized}
          loading={this.state.loading}
        />
      </>
    );
  }
}

HubApiForm.propTypes = {
  auto: PropTypes.array,
  fields: PropTypes.array,
  useFetch: PropTypes.bool,
}

export default HubApiForm;
