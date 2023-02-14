import BaseObject from './BaseObject';

export default class extends BaseObject {

  getThumbnailFieldName() {
    return 'headshot';
  }

  getText() {
    return `${this.props.data.first_name} ${this.props.data.last_name}`;
  }

}
