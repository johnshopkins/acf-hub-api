import fetchJSONP from 'fetch-jsonp';
import env from './env';
import getEndpoint from './includes/getEndpoint';
import getParams from './includes/getParams';

export default class API {

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
      return
    }

    const prefix = env === 'production' ? '' : `${env}.`;
    const url = `https://${prefix}api.hub.jhu.edu/${endpoint}?` + this.getParams(parts, allowPreview, this.auth);

    if (this.useFetch) {
      fetch(url)
        .then((response) => response.json())
        .then(callback);
    } else {
      fetchJSONP(url)
        .then((response) => response.json())
        .then(callback)
        .catch(() => callback({ error: true, message: 'Not Found' })); // 404s
    }
  }
}
