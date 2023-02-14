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

    render(createElement(HubApiForm, data), domObject);
  };

  acf.add_action('ready_field/type=hubapi_content_picker', createHubApiFormField);
  acf.add_action('append_field/type=hubapi_content_picker', createHubApiFormField);

})();
