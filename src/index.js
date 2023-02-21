import { createElement, render } from '@wordpress/element';

import HubApiForm from './js/components/HubApiForm';

(function () {

  /**
   * Create preview component for Hub API field
   * @param el jQuery DOM object
   */
  const createHubApiFormField = (el) => {

    const domObject = el[0].querySelector('.hub-api-field');

    const script = domObject.querySelector('script');
    const data = JSON.parse(domObject.querySelector('script').innerHTML);

    script.remove();

    // replace acfcloneindex with uniqueid. ACF takes care of this in their
    // JS (/assets/js/acf.js#L1478-L1481), but we need to manually do it manually.
    const replace = acf.uniqid('acf');
    data.fields = data.fields.map(value => {
      value.props.id = value.props.id.replace('acfcloneindex', replace);
      value.props.name = value.props.name.replace('acfcloneindex', replace);
      return value;
    });

    render(createElement(HubApiForm, data), domObject);
  };

  acf.add_action('ready_field/type=hubapi_content_picker', createHubApiFormField);
  acf.add_action('append_field/type=hubapi_content_picker', createHubApiFormField);

})();
