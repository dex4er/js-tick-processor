/* The Computer Language Benchmarks Game
   https://salsa.debian.org/benchmarksgame-team/benchmarksgame/

   contributed by Andreas Schmelz 2016-02-14
   modified by Piotr Roszatycki

   Run:

   node --prof --log-all --log-source-code mandelbrot [size [workers]]
   tick-processor --preprocess *-v8-*.log > v8.json
*/

const cluster = require('cluster');
const numCPUs = Number(process.argv[3]) || require('os').cpus().length;

const d = parseInt(process.argv[2]) || 200;

const iter = 50;
const limit = 4;

if (d % 8 !== 0) {
  console.error('d must be multiple of 8');
  process.exit(-1);
}
if (d * d / numCPUs % 8 !== 0) {
  console.error('cannot distribute equal across cpus');
  process.exit(-1);
}

if (cluster.isMaster) {
  let alive = numCPUs;
  const partBuffer = new Array(numCPUs);
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();

    worker.on('message', (msg) => {
      partBuffer[worker.id - 1] = Buffer.from(msg.data);
      worker.kill();
      alive--;

      if (alive === 0) {
        process.stdout.write(`P4\n${d} ${d}\n`);

        for (let j = 0; j < numCPUs; j++) {
          process.stdout.write(partBuffer[j]);
        }
      }
    });
  }
} else if (cluster.isWorker) {
  const id = cluster.worker.id;

  const start = Math.floor((id - 1) * d / numCPUs); // incl
  const end = Math.floor(id * d / numCPUs); // excl

  const buff = doMandelbrot(start, end);

  process.send(buff);
}

function doMandelbrot (start, end) {
  let byteAcc = 0;
  let bitNum = 0;

  const buff = Buffer.alloc(d * d / 8 / numCPUs);

  const xd = 2 / d;

  for (let y = start, it = 0; y < end; y++) {
    const yd = 2 * y / d - 1;

    for (let x = 0; x < d; x++) {
      const sum = doCalc(
        xd * x - 1.5,
        yd
      );

      byteAcc |= (sum <= limit);
      bitNum++;

      if (bitNum === 8) {
        buff[it++] = byteAcc;
        byteAcc = 0;
        bitNum = 0;
      } else {
        byteAcc <<= 1;
      }
    }
  }

  return buff;
}

function doCalc (Cr, Ci) {
  let Zr = 0;
  let Zi = 0;
  let Tr = 0;
  let Ti = 0;

  for (let i = 0; i < iter && Tr + Ti <= limit; i++) {
    Zi = 2 * Zr * Zi + Ci;
    Zr = Tr - Ti + Cr;
    Tr = Zr * Zr;
    Ti = Zi * Zi;
  }

  return Tr + Ti;
}
