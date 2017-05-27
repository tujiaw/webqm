const Styles = {
  message: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '14px',
    flexShrink: 0,
    paddingLeft: '16px',
    paddingRight: '6px',
    paddingTop: '4px',
    paddingBottom: '4px',
  },
  messageBody: {
    display: 'flex', 
    flexDirection: 'column'
  },
  rowContent: {
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'flex-end'
  },
  date: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    color: '#747473',
    fontSize: '12px',
    height: '30px',
    lineHeight: '30px'
  },
  name: {
    fontSize: '13px',
    paddingTop: '6px',
    paddingBottom: '8px',
  },
  contentBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: '15px',
    marginRight: '0px', 
  },
  sendContent: {
    color: '#fff',
  },
  receiveContent: {
    color: '#ffdea6',
  },
  time: {
    width: '80px',
    alignSelf: 'flex-start',
    textAlign: 'right',
    color: '#b4b4c1',
    fontSize: '12px',
    marginLeft: '20px',
  },
  imageLoader: {
    marginTop: '3px',
    borderRadius: '5px'
  }
}

Styles.sendMsg = {
  ...Styles.message
}

Styles.receiveMsg = {
  ...Styles.message,
  background: '#141415',
}

Styles.sendName = {
  ...Styles.name,
  color: '#b8b3af'
}

Styles.receiveName = {
  ...Styles.name,
  color: '#ba9d76'
}

export default Styles;
