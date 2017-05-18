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
  lastMsg: {
    display: 'flex',
    alignSelf: 'flex-start',
    color: '#c5c5c5',
    fontSize: '12px',
  },
}

Styles.item = {
  display: 'flex',
  cursor: 'pointer',
  minHeight: '60px',
  alignItems: 'center',
  paddingLeft: '10px',
  paddingRight: '10px',
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

export default Styles;