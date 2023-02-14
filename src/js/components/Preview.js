import { createElement } from '@wordpress/element';
import PropTypes from 'prop-types';

import Icon from './Icon';
import ObjectComponents from './Objects';

import '../../css/preview.scss';

const Preview = ({ data, initialized, loading }) => {

  if (loading) {
    return <Icon name={'loading'} message={'Validating...'} />;
  }

  if (data) {

    if (data.error) {
      return <Icon name={'invalid'} message={data.message} />;
    }

    if (data.type) {
      // single object; display a preview
      const TagName = data.type;
      const Tag = ObjectComponents[TagName];
      return (
        <div className={'object-preview-wrapper'}>
          <Icon name={'valid'} />
          <Tag data={data} />
        </div>
      );
    }

    // collection
    return <Icon name={'valid'} />;
  }

  if (initialized) {
    // for HAD a value at one point; show invalid
    return <Icon name={'invalid'} />;
  }

  // form not filled out yet
  return null;
};

Preview.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool,
}

export default Preview;
