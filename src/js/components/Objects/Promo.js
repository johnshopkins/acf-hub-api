import BaseObject from './BaseObject';

export default class extends BaseObject {

  getThumbnailFieldName() {
    return 'image_promo';
  }

  getText() {
    return this.props.data._embedded.image_promo[0].alt_text || null;
  }

}
