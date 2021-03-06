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
    marginBottom: '6px',
    background: 'transparent',
    border: '0px',
    outline: 'none',
    color: '#fff',
    fontSize: '14px',
    padding: '0px', 
    resize: 'none',
  },
  sendButtonBox: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center'
  },
  newlineSpan: {
    color: '#BDBDBD',
    marginRight: '15px',
  },
  sendButton: {
    lineHeight: '25px',
    height: '25px'
  },
  overlayButton: {
    lineHeight: '25px',
    height: '25px'
  },
  inputPanel: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '10px',
    marginRight: '15px',
    marginBottom: '10px',
  },
  faceButton: {
    margin: '0px',
    padding: '0px',
    width: '36px',
    height: '36px'
  },
}

export default Styles;