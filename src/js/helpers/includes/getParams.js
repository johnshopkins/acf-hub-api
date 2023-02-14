export default (parts, allowPreview, auth) => {
  let params = {
    key: auth.key,
    v: auth.v,
    preview: allowPreview
  };

  if (parts.id) {
    if (parts.collection === 'articles') {
      params.source = 'all';
    } else if (parts.collection === 'events') {
      params.type = 'all';
    }
  }

  if (parts.collection === 'galleries' || parts.subcollection === 'galleries') {
    params.has_page = true;
  }

  return new URLSearchParams(params).toString();
};
