import { createElement } from '@wordpress/element';
import PropTypes from 'prop-types';

import InvalidIcon from '../icons/invalid';
import LoadingIcon from '../icons/loading';
import ValidIcon from '../icons/valid';

import '../../css/icons.scss';

const IconComponents = {
  loading: LoadingIcon,
  invalid: InvalidIcon,
  valid: ValidIcon,
}

const Icon = ({ name, message }) => {

  const classes = ['icon', name];
  const Tag = IconComponents[name];

  return (
    <div className={classes.join(' ')} data-testid={'icon'}>
      <Tag />
      {message && <p>{message}</p>}
    </div>
  );
};

Icon.propTypes = {
  message: PropTypes.string,
  name: PropTypes.string.isRequired,
}

export default Icon;
