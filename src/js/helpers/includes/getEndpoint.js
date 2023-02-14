export default (parts) => {

  let endpoint = parts.collection;

  if (parts.id) {
    endpoint += '/' + parts.id;
  }

  if (parts.id && parts.subcollection) {
    endpoint += '/' + parts.subcollection;
  }

  return endpoint;
};
