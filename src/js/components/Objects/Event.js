import BaseObject from './BaseObject';

export default class extends BaseObject {

  getText() {
    return this.props.data.name;
  }

}
