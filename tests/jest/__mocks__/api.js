import getEndpoint from '../../../src/js/helpers/includes/getEndpoint';
import getParams from '../../../src/js/helpers/api/includes/getParams';

export default class MockAPI {

  constructor(auth, useFetch) {
    this.auth = auth;
    this.useFetch = useFetch;
    this.getEndpoint = getEndpoint;
    this.getParams = getParams;
  }

  get(parts, allowPreview, callback) {

    const endpoint = this.getEndpoint(parts);

    if (endpoint === '') {
      callback(null);

    } else if (endpoint === 'articles') {
      // will trigger a valid icon rendering
      callback({});

    } else if (endpoint === 'articles/123') {
      callback({
        type: 'article',
        headline: 'Article 123',
        _embedded: { image_thumbnail: null }
      });
    } else if (endpoint === 'articles/123/topics') {
      callback({});
    }
  }
}
