const Styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    height: '100vh'
  },
  messagePanel: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflowY: 'scroll',
    paddingBottom: '10px',
  },
  inputMessage: {
    display: 'flex',
    flex: 1,
    marginLeft: '6px',
    marginBottom: '10px',
    background: 'transparent',
    border: '0px',
    outline: 'none',
    color: '#fff',
    fontSize: '14px',
    resize: 'none',
  },
  sendButtonBox: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center'
  },
  newlineSpan: {
    color: '#BDBDBD'
  },
  sendButton: {
    marginLeft: '20px',
    width: '90px',
  },
  inputPanel: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '10px',
    marginRight: '15px',
    marginBottom: '10px',
  },
  inputMsg: {
    display: 'flex',
    flex: 1,
    margin: '0px',
    padding: '0px',
  },
  faceButton: {
    margin: '0px',
    padding: '0px',
    width: '36px',
    height: '36px'
  }
}

export default Styles;