const { echo, exec, exit, rm } = require('shelljs');

function execWithCode (expected, ...args) {
  const pipe = exec(...args);
  const { code } = pipe;
  if (code !== expected) {
    echo('Wrong status code:', code);
    exit(1);
  }
  return pipe;
}

execWithCode(2, 'bin/tick-processor --help');

rm('-f', '*-v8*.log', 'v8.json');

execWithCode(0, 'node --prof --log-all --log-source-code examples/mandelbrot 200 1', { silent: true });
execWithCode(0, 'bin/tick-processor --preprocess *-v8*.log', { silent: true }).to('v8.json');
execWithCode(0, 'bin/tick-processor *-v8*.log');

rm('-f', '*-v8*.log', 'v8.json');
