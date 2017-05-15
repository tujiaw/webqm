const Styles = {
  list: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
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
  minHeight: '60px',
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

export default Styles;