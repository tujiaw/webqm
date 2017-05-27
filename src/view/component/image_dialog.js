import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
class ImageDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: ''
    }
  }

  handleClose = () => {
    this.setState({
      inputText: ''
    });
    if (this.props.onClose) {
      this.props.onClose('');
    }
  };

  handleOk = () => {
    const inputText = this.state.inputText;
    this.setState({
      inputText: ''
    });
    if (this.props.onClose) {
      this.props.onClose(inputText);
    }
  }

  onInputChange = (event, newValue) => {
    this.setState({
      inputText: newValue
    })
  }

  render() {
    const actions = [
      <FlatButton
        label="取消"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="发送"
        primary={true}
        disabled={!this.state.inputText.length}
        onTouchTap={this.handleOk}
      />,
    ];

    return (
        <Dialog
          title="请输入图片链接地址："
          actions={actions}
          modal={true}
          open={this.props.open}
        >
          <TextField id="input_image_url" hintText="图片URL" fullWidth={true} onChange={this.onInputChange}/>
        </Dialog>
    );
  }
}

export default ImageDialog;