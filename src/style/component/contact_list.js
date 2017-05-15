const Styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'scroll',
  },
  avatar: {
    width: '50px',
    height: '50px'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    paddingLeft: '15px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    alignItems: 'space-between',
  },
  username: {
    display: 'flex',
    alignSelf: 'flex-start',
  },
  company: {
    display: 'flex',
    alignSelf: 'flex-start',
  },
}

Styles.item = {
  display: 'flex',
  cursor: 'pointer',
  height: '60px',
  alignItems: 'center',
  paddingLeft: '10px',
  paddingRight: '10px',
}

Styles.itemHover = {
  ...Styles.item,
  background: '#B0C4DE'
}

Styles.itemSelected = {
  ...Styles.item,
  background: '#0E9496'
}

/**
 * 分组样式
 */
Styles.groupItem = {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  }

Styles.userList = {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },

Styles.group = {
  display: 'flex',
  height: '30px',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
  flexShrink: 0,
}
Styles.groupPressed = {
  ...Styles.group,
  background: '#eee',
}
Styles.groupLeft = {
  display: 'flex',
  marginLeft: '20px'
}
Styles.groupRight = {
  display: 'flex',
  marginRight: '20px'
}
Styles.groupName = {
  
}
Styles.memberCount = {
  marginLeft: '10px',
}
export default Styles;