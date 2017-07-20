import React, { Component } from 'react';
import Styles from '../../style/component/contact_list'

const ItemAction = {
  normal: 'normal',
  hover: 'hover',
  selected: 'selected'
};

/**
 * 用户
 */
class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      action: ItemAction.normal
    }
  }

  onMouseEnter = () => {
    this.setState({
      action: ItemAction.hover
    });
  }

  onMouseLeave = () => {
    this.setState({
      action: ItemAction.normal
    });
  }

  onClick = () => {
    this.setState({
      action: ItemAction.selected
    });
    if (this.props.onItemClick) {
      this.props.onItemClick(this.props.id);
    }
  }

  render() {
    const self = this;
    const {title, subtitle, avatar} = this.props;
    const itemStyle = (function getItemStyle() {
      if (self.state.action === ItemAction.hover) {
        return Styles.itemHover;
      } else if (self.state.action === ItemAction.selected) {
        return Styles.itemSelected;
      } else {
        return Styles.item;
      }
    })();

    return <div style={itemStyle}
        onMouseEnter={this.onMouseEnter} 
        onMouseLeave={this.onMouseLeave} 
        onClick={this.onClick} >
        <img style={Styles.avatar} src={avatar} alt='avatar'/>
        <div style={Styles.content}>
          <div style={Styles.title}>{title || ''}</div>
          <div style={Styles.subtitle}>{subtitle || ''}</div>
        </div>
      </div>
  }
}

/**
 * 分组
 */
class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPressed: false,
      isExpand: this.props.group.isExpand,
    }
  }

  onMouseDown = () => {
    this.setState({
      isPressed: true
    })
  }

  onMouseUp = () => {
    const isExpand = !this.state.isExpand;
    this.setState({
      isPressed: false,
      isExpand: isExpand,
    })
    const {onGroupExpand, group} = this.props;
    if (onGroupExpand) {
      onGroupExpand(group.id, isExpand);
    }
  }

  render() {
    const {group, onItemClick} = this.props;
    const groupStyle = (this.state.isPressed ? Styles.groupPressed : Styles.group);
    const groupArrow = (this.state.isExpand ? "/imgs/temp_down.png" : "/imgs/temp_up.png");

    return (
      <div style={Styles.groupItem}>
      <div style={groupStyle} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp}>
        <div style={Styles.groupLeft}>
          <div style={Styles.groupName}>{group.name}</div>
          <div style={Styles.memberCount}>{group.count}</div>
        </div>
        <div style={Styles.groupRight}>
          <img style={Styles.arrow} src={groupArrow} alt='arrow'/>
        </div>
      </div>
        { this.state.isExpand && group.members
          ? <div style={Styles.userList}>
              {
                group.members.map((member, index) => {
                return <Item key={index} 
                  id={member.id} 
                  title={member.title} 
                  subtitle={member.subtitle} 
                  avatar={member.avatar}
                  onItemClick={onItemClick}
                />})
              }
            </div>
          : ''}
      </div>
    )
  }
}

class GroupList extends Component {  
  render() {
    return (
      <div style={Styles.main}>
        {this.props.groups.map((group, index) => {
          return <Group key={index}
            group={group}
            onGroupExpand={this.props.onGroupExpand}
            onItemClick={this.props.onItemClick} />
        })}
      </div>
    )
  }
}

export default GroupList;