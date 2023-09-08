import { createElement, createRoot } from '@wordpress/element';

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

    // grab the ID ACF designated for this duplication
    const replaceWith = script.getAttribute('id');

    script.remove();

    // replace acfcloneindex with uniqueid. ACF takes care of this in
    // their acf.js, but we need to manually do it manually. ACF ref:
    // https://github.com/johnshopkins/acf-pro/blob/master/assets/build/js/acf.js#L3294-L3297
    data.fields = data.fields.map(value => {
      value.props.id = value.props.id.replace('acfcloneindex', replaceWith);
      value.props.name = value.props.name.replace('acfcloneindex', replaceWith);
      return value;
    });

    const root = createRoot(domObject);
    root.render(createElement(HubApiForm, data));
  };

  acf.add_action('ready_field/type=hubapi_content_picker', createHubApiFormField);
  acf.add_action('append_field/type=hubapi_content_picker', createHubApiFormField);

})();
