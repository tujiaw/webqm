import React, { Component } from 'react';
import Styles from '../../style/component/face_dialog.js';

import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import getFaceList from '../../utils/face_xml';

class FaceDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faceList: []
    }
  }

  componentDidMount() {
    this.setState({ faceList: getFaceList() });
  }

  onFaceSelected = (face) => {
    if (this.props.onSelected) {
      this.props.onSelected(face);
    }
  }

  getRect() {
    const root = this.refs.root;
    return {
      left: root.offsetLeft,
      top: root.offsetTop,
      right: root.offsetLeft + root.offsetWidth,
      bottom: root.offsetTop + root.offsetHeight
    }
  }

  render() {
    const { faceButtonPos, faceDialogSize } = this.props;
    Styles.gridList.width = faceDialogSize.width;
    Styles.gridList.height = faceDialogSize.height;
    Styles.root.left = faceButtonPos.left;
    Styles.root.top = faceButtonPos.top - faceDialogSize.height - 20;
    Styles.root.width = faceDialogSize.width;
    Styles.root.height = faceDialogSize.height + 10;
    return (
      <div ref="root" style={Styles.root}>
        <GridList
          cellHeight={25}
          padding={8}
          cols={8}
          style={Styles.gridList}
        >
          {this.state.faceList.map((face, index) => {
            return <img key={index} src={face.name} alt={face.desc} title={face.desc} onClick={this.onFaceSelected.bind(this, face)}/>
          })}
        </GridList>
      </div>
    )
  }
}

export default FaceDialog;