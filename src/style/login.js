import {orange500} from 'material-ui/styles/colors';

const Styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundImage: "url('/imgs/bg_login_body.png')",
    backgroundColor: '#0C868F',
    paddingBottom: '100px',
  },
  title: {
    color: '#333'
  },
  vLayout: {
    display: 'flex',
    flexDirection: 'column',
  },
  underlineStyle: {
    borderColor: orange500
  },
  snackbarBody: {
    background: '#CCCCCC',
  },

  checkbox: {
    color: '#9E9E9E',
  },
  spanWidth: {
    display: 'flex',
    width: '60px',
  },
  usernameHLayout: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '10px'
  },
  passwordHLayout: {
    display: 'flex',
    flexDirection: 'row',
    
    marginBottom: '10px'
  },
  rememberMeHLayout: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-center',
  },
  loginButton: {
    margin: '10px',
    width: '100px',
    height: '30px',
    alignSelf: 'center',
  },
  progress: {
    margin: '20px',
    alignSelf: 'center',
    height: '60px',
  }
}

Styles.progressVisible = {
    ...Styles.progress,
    visibility: 'visible'
}

Styles.progressHidden = {
  ...Styles.progress,
  visibility: 'hidden'
}

export default Styles;