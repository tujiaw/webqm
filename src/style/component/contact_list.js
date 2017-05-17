const Styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'scroll',
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '25px',
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
    color: '#ffe9c8',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  company: {
    display: 'flex',
    alignSelf: 'flex-start',
    color: '#c5c5c5',
    fontSize: '12px',
  },
}

Styles.item = {
  display: 'flex',
  cursor: 'pointer',
  height: '60px',
  alignItems: 'center',
  paddingLeft: '10px',
  paddingRight: '10px',
  background: '#141415',
  borderBottom: '1px solid #28282C',
}

Styles.itemHover = {
  ...Styles.item,
  background: '#0E9496'
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
    background: '#19191B',
    borderBottom: '1px solid #28282C',
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
  background: '#141415',
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
  color: '#ffffff',
}
Styles.memberCount = {
  marginLeft: '10px',
  color: '#848484',
}
export default Styles;