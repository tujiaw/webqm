const Styles = {
  root: {
    display: 'flex', 
    flexDirection: 'column', 
    width: '100%',
    height: '100vh'
  },
  head: {
    display: 'flex',
    flexDirection: 'row',
    flexShrink: 0,
    marginRight: 20,
    marginTop: 10
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    overflowY: 'scroll',
    marginBottom: '10px',
    justifyContent: 'space-between',
  },
  searchInput: {
    width: '100%', 
    paddingRight: 50
  },
  searchButton: {
    position: 'fixed', 
    right: 10
  },
  itemInner: {
    paddingTop: 6, 
    paddingBottom:6
  }
}

export default Styles;