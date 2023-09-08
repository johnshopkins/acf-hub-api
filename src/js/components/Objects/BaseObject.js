import { Component } from '@wordpress/element';

const Link = ({ text, url }) =>
  <a href={url} target={'_blank'}>{text}</a>;

const Thumbnail = ({ thumbnail }) => {
  return <img src={thumbnail.sizes.thumbnail} alt={thumbnail.alt_text} className={'thumbnail'} />;
}

class BaseObject extends Component {

  constructor(props) {
    super(props);
  }

  getThumbnail() {
    const thumbnameFieldName = this.getThumbnailFieldName();

    if (this.props.data._embedded && typeof this.props.data._embedded[thumbnameFieldName] !== 'undefined' && this.props.data._embedded[thumbnameFieldName] !== null) {
      return (
        <div className={'img-container'}>
          <Thumbnail thumbnail={this.props.data._embedded[thumbnameFieldName][0]} />
        </div>
      )
    }

    return false;
  }

  /**
   * Image type type to use as the thumbnail
   * @returns string
   */
  getThumbnailFieldName() {
    return 'image_thumbnail';
  }

  getText() {
    return this.props.data.headline;
  }

  getClasses() {

    const classes = ['object', this.props.data.type];

    // if (this.thumbnail) {
    //   classes.push('has-image');
    // }

    return classes.join(' ');
  }

  getMaybeLink() {
    const text = this.getText();

    if (this.props.data.url) {
      return <p><Link text={text} url={this.props.data.url} data-testid={'text'} /></p>;
    }

    return <p data-testid={'text'}>{text}</p>;
  }

  render() {
    this.thumbnail = this.getThumbnail();

    return (
      <div className={this.getClasses()} data-testid={'object'}>
        {this.thumbnail}
        {this.getMaybeLink()}
      </div>
    );
  };

}

export default BaseObject;
