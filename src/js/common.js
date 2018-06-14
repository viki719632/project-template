var $ = require('jquery');

function showName() {
	console.log('showName');
}

function showText() {
	console.log('showText');
}

var demo = ()=>{
	console.log(111);
}

module.exports = {
	showName: showName,
	showText: showText,
	demo: demo,
};