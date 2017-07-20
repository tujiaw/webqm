import React, { Component } from 'react';
import Styles from '../../style/component/face_dialog.js';

import {GridList} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Emoticon from '../../utils/emoticon_xml';

class FaceDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faceList: [],
      faceHeight: 25,
      cols: 8,
    }
  }

  componentDidMount() {
    this.setState({ faceList: Emoticon.faceList });
  }

  onFaceSelected = (face) => {
    if (this.props.onSelected) {
      this.props.onSelected(face);
    }
  }

  onFaceClick = () => {
    this.setState({ 
      faceList: Emoticon.faceList,
      faceHeight: 25,
      cols: 8
    });
  }

  onSmartQClick = () => {
    this.setState({
      faceList: Emoticon.smartQList,
      faceHeight: 45,
      cols: 5
    })
  }

  render() {
    const { faceButtonPos, faceDialogSize } = this.props;
    Styles.gridList.width = faceDialogSize.width;
    Styles.gridList.height = faceDialogSize.height;
    Styles.root.left = faceButtonPos.left;
    Styles.root.top = faceButtonPos.top - faceDialogSize.height - 20;
    Styles.root.width = faceDialogSize.width;
    Styles.root.height = faceDialogSize.height + 30;
    return (
      <div style={Styles.root}>
        <GridList
          cellHeight={this.state.faceHeight}
          padding={8}
          cols={this.state.cols}
          style={Styles.gridList}
        >
          {this.state.faceList.map((face, index) => {
            return <img key={index} style={{width: this.state.faceHeight, height: this.state.faceHeight}} src={face.path} alt={face.desc} title={face.desc} onClick={this.onFaceSelected.bind(this, face)}/>
          })}
        </GridList>
        <div>
          <IconButton
            onTouchTap={this.onFaceClick}
            style={{width: 40, height: 24, margin: 0, padding:0}}
            tooltip="默认表情"
            tooltipPosition="top-right">
            <img src="/imgs/tab_emoticon.png" alt="[图片]" />
          </IconButton>
          <IconButton
            onTouchTap={this.onSmartQClick}
            style={{width: 40, height: 24, margin: 0, padding:0}}
            tooltip="小Q表情包"
            tooltipPosition="top-right">
            <img src="/imgs/tab_bao.png" alt="[图片]" />
          </IconButton>
        </div>
      </div>
    )
  }
}

export default FaceDialog;