import BaseObject from './BaseObject';

export default class extends BaseObject {

  getThumbnailFieldName() {
    return 'image_thumbnail';
  }

  getText() {
    return this.props.data.name || null;
  }

}
