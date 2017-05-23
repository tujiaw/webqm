import Color from '../color';

const Styles = {
  list: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
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
    justifyContent: 'space-between',
    paddingLeft: '15px',
    height: '40px',
  },
  username: {
    display: 'flex',
    alignSelf: 'flex-start',
    color: '#ffe9c8',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  lastMsg: {
    display: 'flex',
    alignSelf: 'flex-start',
    color: '#c5c5c5',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginRight: '20px',
  },
}

Styles.item = {
  display: 'flex',
  cursor: 'pointer',
  minHeight: '60px',
  alignItems: 'center',
  paddingLeft: '10px',
  background: Color.itemBackground,
  borderBottom: Color.itemUnderline,
}

Styles.itemHover = {
  ...Styles.item,
  background: Color.itemHover
}

Styles.itemSelected = {
  ...Styles.item,
  background: Color.itemHover
}

Styles.right = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '40px',
  width: '50px',
}

Styles.time = {
  color: '#c5c5c5',
}

Styles.unreadCount = {
  background: '#D83232',
  borderRadius: '20px',
  width: '27px',
  height: '18px',
  textAlign: 'center',
}

Styles.unreadCountVisible = {
  ...Styles.unreadCount,
  visibility: 'visible'
}

Styles.unreadCountHidden = {
  ...Styles.unreadCount,
  visibility: 'hidden'
}

export default Styles;