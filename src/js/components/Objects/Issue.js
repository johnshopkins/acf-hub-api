import BaseObject from './BaseObject';

export default class extends BaseObject {

  getThumbnailFieldName() {
    return 'image_cover';
  }

  getText() {
    return `${this.props.data.publication} ${this.props.data.year} ${this.props.data.edition}`;
  }

}
