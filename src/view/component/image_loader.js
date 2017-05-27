import React from 'react';
const {span} = React.DOM;
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const Status = {
  PENDING: 'pending',
  LOADING: 'loading',
  LOADED: 'loaded',
  FAILED: 'failed',
};

const Styles = {}
Styles.img = {
  width: '200px',
  height: '150px',
  borderRadius: '5px',
  cursor: 'pointer',
}

Styles.mouseEnter = {
  ...Styles.img,
  background:'#fff',
  filter: 'alpha(opacity=60)',
  opacity: 0.6,
}

Styles.mouseLeave = {
  ...Styles.img,
  background: 'transparent',
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
    const {src, imgwidth, imgheight} = this.props;
    let props = {src};

    if (imgwidth) {
      Styles.img.width = imgwidth;
    }
    if (imgheight) {
      Styles.img.height = imgheight;
    }

    return <img {...props} 
        onClick={this.onImageClick} 
        style={this.state.isMouseEnter ? Styles.mouseEnter : Styles.mouseLeave} 
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      />;
  }

  render() {
    let wrapperProps = {};
    if (this.props.style) {
      wrapperProps.style = this.props.style;
    }

    let wrapperArgs = [wrapperProps];
    wrapperArgs.push(this.renderImg());

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
