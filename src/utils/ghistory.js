import { createBrowserHistory } from 'history';
import Config from '../config/config';

const ghistory = createBrowserHistory();

ghistory.goMain = function() {
  ghistory.push(`${Config.prefix}/main`);
}

ghistory.goDialogue = function() {
  ghistory.push(`${Config.prefix}/dialogue`);
}

ghistory.goUserInfo = function(id) {
  ghistory.push(`${Config.prefix}/user`, {userid: id});
}

ghistory.goRoomInfo = function(id) {
  ghistory.push(`${Config.prefix}/room`, {roomid: id});
}

ghistory.goSearch = function() {
  ghistory.push(`${Config.prefix}/search`);
}

export default ghistory;