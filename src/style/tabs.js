const Styles = {};
Styles.main = {
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100vh',
  overflow: 'hidden',
}

Styles.pageList = {
  display: 'flex',
  flex: 1
}

Styles.tab = {
  fontSize: '10px',
  height: '60px'
}

Styles.tabButton = {
  height: '60px'
}

Styles.bottomPanel = {
  background: '#eee'
}

Styles.bottomButtons = {
  display: 'flex',
  listStyleType: 'none',
  padding: 0,
  justifyContent: 'space-around'
}

Styles.hide = {
  display: 'none'
}

Styles.badge = {
  position: 'absolute', 
  background:'#D83232', 
  left:25, 
  bottom: 20, 
  width: 10,
  height: 10, 
  borderRadius:10
}

Styles.badgeVisible = {
  ...Styles.badge,
  visibility: 'visible'
}

Styles.badgeHidden = {
  ...Styles.badge,
  visibility: 'hidden'
}

export default Styles;