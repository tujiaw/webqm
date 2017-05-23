const { Map, List } = require('immutable');
const parseString = require('xml2js').parseString;

const faceXml = `
<?xml version="1.0" encoding="utf-8"?>
<library>
	<faces width="28" height="28" columns="8" describe="默认">
		<face name=":/face/1.png"  pathname="1.png"  shortcut="" order="1"  describe="微笑" />
		<face name=":/face/2.png"  pathname="2.png"  shortcut="" order="2"  describe="呲牙" />
		<face name=":/face/3.png"  pathname="3.png"  shortcut="" order="10" describe="害羞" />
		<face name=":/face/4.png"  pathname="4.png"  shortcut="" order="7"  describe="得意" />
		<face name=":/face/5.png"  pathname="5.png"  shortcut="" order="-1" describe="喜爱" />
		<face name=":/face/6.png"  pathname="6.png"  shortcut="" order="25" describe="坏笑" />
		<face name=":/face/7.png"  pathname="7.png"  shortcut="" order="21" describe="亲亲" />
		<face name=":/face/8.png"  pathname="8.png"  shortcut="" order="-1" describe="皱眉" />
		<face name=":/face/9.png"  pathname="9.png"  shortcut="" order="11" describe="扣鼻" />
		<face name=":/face/10.png" pathname="10.png" shortcut="" order="24" describe="抓狂" />
		<face name=":/face/11.png" pathname="11.png" shortcut="" order="3"  describe="惊恐" />
		<face name=":/face/12.png" pathname="12.png" shortcut="" order="35" describe="晕" />
		<face name=":/face/13.png" pathname="13.png" shortcut="" order="-1" describe="失望" />
		<face name=":/face/14.png" pathname="14.png" shortcut="" order="-1" describe="抽泣" />
		<face name=":/face/15.png" pathname="15.png" shortcut="" order="5"  describe="流泪" />
		<face name=":/face/16.png" pathname="16.png" shortcut="" order="22" describe="大哭" />
		<face name=":/face/17.png" pathname="17.png" shortcut="" order="4"  describe="流汗" />
		<face name=":/face/18.png" pathname="18.png" shortcut="" order="-1" describe="叹气" />
		<face name=":/face/19.png" pathname="19.png" shortcut="" order="-1" describe="拜佛" />
		<face name=":/face/20.png" pathname="20.png" shortcut="" order="-1" describe="禁言" />
		<face name=":/face/21.png" pathname="21.png" shortcut="" order="9"  describe="吐" />
		<face name=":/face/22.png" pathname="22.png" shortcut="" order="-1" describe="感冒" />
		<face name=":/face/23.png" pathname="23.png" shortcut="" order="32" describe="疑问" />
		<face name=":/face/24.png" pathname="24.png" shortcut="" order="-1" describe="晕倒" />
		<face name=":/face/25.png" pathname="25.png" shortcut="" order="8"  describe="发怒" />
		<face name=":/face/26.png" pathname="26.png" shortcut="" order="41" describe="熊市" />
		<face name=":/face/27.png" pathname="27.png" shortcut="" order="42" describe="牛市" />
		<face name=":/face/28.png" pathname="28.png" shortcut="" order="-1" describe="强" />
		<face name=":/face/29.png" pathname="29.png" shortcut="" order="-1" describe="弱" />
		<face name=":/face/30.png" pathname="30.png" shortcut="" order="-1" describe="OK" />
		<face name=":/face/31.png" pathname="31.png" shortcut="" order="48" describe="胜利" />
		<face name=":/face/32.png" pathname="32.png" shortcut="" order="28" describe="鼓掌" />
		<face name=":/face/33.png" pathname="33.png" shortcut="" order="45" describe="拳头" />
		<face name=":/face/34.png" pathname="34.png" shortcut="" order="46" describe="肌肉" />
		<face name=":/face/35.png" pathname="35.png" shortcut="" order="38" describe="示爱" />
		<face name=":/face/36.png" pathname="36.png" shortcut="" order="-1" describe="爱心" />
		<face name=":/face/37.png" pathname="37.png" shortcut="" order="-1" describe="心碎" />
		<face name=":/face/38.png" pathname="38.png" shortcut="" order="-1" describe="星星" />
		<face name=":/face/39.png" pathname="39.png" shortcut="" order="-1" describe="地雷" />
		<face name=":/face/40.png" pathname="40.png" shortcut="" order="-1" describe="庆祝" />
		<face name=":/face/41.png" pathname="41.png" shortcut="" order="43" describe="便便" />
		<face name=":/face/42.png" pathname="42.png" shortcut="" order="37" describe="玫瑰" />
		<face name=":/face/43.png" pathname="43.png" shortcut="" order="40" describe="啤酒" />
		<face name=":/face/44.png" pathname="44.png" shortcut="" order="-1" describe="西瓜" />
		<face name=":/face/45.png" pathname="45.png" shortcut="" order="-1" describe="钱袋" />
		<face name=":/face/46.png" pathname="46.png" shortcut="" order="-1" describe="元宝" />
		<face name=":/face/47.png" pathname="47.png" shortcut="" order="-1" describe="存钱" />
		<face name=":/face/48.png" pathname="48.png" shortcut="" order="-1" describe="钻石" />
		<face name=":/face/49.png" pathname="49.png" shortcut="" order="6"  describe="色" />
		<face name=":/face/50.png" pathname="50.png" shortcut="" order="12" describe="白眼" />
		<face name=":/face/51.png" pathname="51.png" shortcut="" order="13" describe="小声" />
		<face name=":/face/52.png" pathname="52.png" shortcut="" order="14" describe="闭嘴" />
		<face name=":/face/53.png" pathname="53.png" shortcut="" order="15" describe="困" />
		<face name=":/face/54.png" pathname="54.png" shortcut="" order="16" describe="睡" />
		<face name=":/face/55.png" pathname="55.png" shortcut="" order="17" describe="撇嘴" />
		<face name=":/face/56.png" pathname="56.png" shortcut="" order="18" describe="偷笑" />
		<face name=":/face/57.png" pathname="57.png" shortcut="" order="19" describe="可怜" />
		<face name=":/face/58.png" pathname="58.png" shortcut="" order="20" describe="笑哭" />
		<face name=":/face/59.png" pathname="59.png" shortcut="" order="23" describe="疑虑" />
		<face name=":/face/60.png" pathname="60.png" shortcut="" order="26" describe="左哼哼" />
		<face name=":/face/61.png" pathname="61.png" shortcut="" order="27" describe="右哼哼" />
		<face name=":/face/62.png" pathname="62.png" shortcut="" order="29" describe="难过" />
		<face name=":/face/63.png" pathname="63.png" shortcut="" order="30" describe="调皮" />
		<face name=":/face/64.png" pathname="64.png" shortcut="" order="31" describe="阴险" />
		<face name=":/face/65.png" pathname="65.png" shortcut="" order="33" describe="委屈" />
		<face name=":/face/66.png" pathname="66.png" shortcut="" order="34" describe="惊讶" />
		<face name=":/face/67.png" pathname="67.png" shortcut="" order="36" describe="鄙视" />
		<face name=":/face/68.png" pathname="68.png" shortcut="" order="39" describe="咖啡" />
		<face name=":/face/69.png" pathname="69.png" shortcut="" order="-1" describe="香蕉" />
		<face name=":/face/70.png" pathname="70.png" shortcut="" order="47" describe="再见" />
		<face name=":/face/71.png" pathname="71.png" shortcut="" order="44" describe="点赞" />
	</faces>
</library>
`

parseString(faceXml, {trim: true}, function(err, result) {
  const faceList = result.library.faces[0].face;
  for (let i = 0; i < faceList.length; i++) {
    console.log(faceList[i].$.pathname);
  }
})