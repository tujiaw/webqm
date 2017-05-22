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
  sendName: {
    fontSize: '13px',
    color: '#b8b3af',
    paddingTop: '6px',
    paddingBottom: '12px',
  },
  receiveName: {
    color: '#ba9d76',
    fontSize: '13px',
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
    marginRight: '15px',
  },
  receiveContent: {
    color: '#ffdea6',
    marginRight: '15px',
  },
  time: {
    width: '80px',
    alignSelf: 'flex-start',
    textAlign: 'right',
    color: '#b4b4c1',
    fontSize: '12px',
  },
  img: {
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

export default Styles;