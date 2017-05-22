import React from 'react';
import PropTypes from 'prop-types';
const {span} = React.DOM;
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const Status = {
  PENDING: 'pending',
  LOADING: 'loading',
  LOADED: 'loaded',
  FAILED: 'failed',
};

const Styles = {
  mouseEnter: {
    background:'#fff',
    filter: 'alpha(opacity=60)',
    opacity: 0.6,
    cursor: 'pointer',
    borderRadius: '5px',
  },
  mouseLeave: {
    background: 'transparent',
    cursor: 'pointer',
    borderRadius: '5px',
  }
}
export default class ImageLoader extends React.Component {
  static defaultProps = {
    wrapper: span,
  };

  constructor(props) {
    super(props);
    this.state = {
      status: props.src ? Status.LOADING : Status.PENDING,
      open: false,
      isMouseEnter: false,
      previewImgUrl: ''
    };
  }

  componentDidMount() {
    if (this.state.status === Status.LOADING) {
      this.createLoader();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.src !== nextProps.src) {
      this.setState({
        status: nextProps.src ? Status.LOADING : Status.PENDING,
      });
    }
  }

  componentDidUpdate() {
    if (this.state.status === Status.LOADING && !this.img) {
      this.createLoader();
    }
  }

  componentWillUnmount() {
    this.destroyLoader();
  }

  getClassName = () => {
    let className = `imageloader ${this.state.status}`;
    if (this.props.className) className = `${className} ${this.props.className}`;
    return className;
  }

  createLoader = () => {
    this.destroyLoader();  // We can only have one loader at a time.

    this.img = new Image();
    this.img.onload = this.handleLoad;
    this.img.onerror = this.handleError;
    this.img.src = this.props.src;
  }

  destroyLoader = () => {
    if (this.img) {
      this.img.onload = null;
      this.img.onerror = null;
      this.img = null;
    }
  }

  handleLoad = (event) => {
    this.destroyLoader();
    this.setState({status: Status.LOADED});

    if (this.props.onLoad) this.props.onLoad(event);
  }

  handleError = (error) => {
    this.destroyLoader();
    this.setState({status: Status.FAILED});

    if (this.props.onError) this.props.onError(error);
  }

  onImageClick = () => {
    this.setState({
      previewImgUrl: this.props.srcUrl,
      open: true
    });
  }

  onMouseEnter = () => {
    this.setState({isMouseEnter: true});
  }

  onMouseLeave = () => {
    this.setState({isMouseEnter: false});
  }

  handleClose = () => {
    this.setState({open: false});
  }

  renderImg = () => {
    const {src, imgProps} = this.props;
    let props = {src};

    for (let k in imgProps) {
      if (imgProps.hasOwnProperty(k)) {
        props[k] = imgProps[k];
      }
    }

    return <img {...props} 
        onClick={this.onImageClick} 
        style={this.state.isMouseEnter ? Styles.mouseEnter : Styles.mouseLeave} 
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      />;
  }

  render() {
    let wrapperProps = {
      className: this.getClassName(),
    };

    if (this.props.style) {
      wrapperProps.style = this.props.style;
    }

    let wrapperArgs = [wrapperProps];

    switch (this.state.status) {
      case Status.LOADED:
        wrapperArgs.push(this.renderImg());
        break;

      case Status.FAILED:
        if (this.props.children) wrapperArgs.push(this.props.children);
        break;

      default:
        if (this.props.preloader) wrapperArgs.push(this.props.preloader());
        break;
    }

     const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
    ];

    return this.props.wrapper(...wrapperArgs,
        <Dialog
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
          autoDetectWindowHeight={true}
          repositionOnUpdate={false}
          style={{margin: '0px', padding: '0px'}}
        >
          <img src={this.state.previewImgUrl} alt='图片'></img>
        </Dialog>
    );
  }
}

ImageLoader.propTypes = {
    wrapper: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
    preloader: PropTypes.func,
    src: PropTypes.string,
    onLoad: PropTypes.func,
    onError: PropTypes.func,
    imgProps: PropTypes.object,
}
