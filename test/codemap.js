/* global describe, it, CodeMap */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function load (file) {
  const filename = path.join(__dirname, file);
  const code = fs.readFileSync(filename).toString();
  new vm.Script(code, { filename, displayErrors: true }).runInThisContext();
}

load('../lib/splaytree.js');
load('../lib/codemap.js');

describe('CodeMap', function () {
  it('should find 64-bit dynamic JS code address', function () {
    const codeMap = new CodeMap();

    const libAddress = 0x3e02000;
    codeMap.addLibrary(libAddress, new CodeMap.CodeEntry(0x1000, 'lib', 'CPP'));

    // 32-bit part of the JS address (0x3e022a4) occasionally falls
    // into the address range of added library (0x3e02000 - 0x3e02fff)
    const jsAddress = 0xe6703e022a4;
    codeMap.addCode(jsAddress, new CodeMap.CodeEntry(0x1000, 'myScript', 'JS'));

    // sanity check
    const foundLibCodeEntry = codeMap.findAddress(libAddress);
    assert.notStrictEqual(foundLibCodeEntry, null);
    assert.notStrictEqual(foundLibCodeEntry.entry, null);
    assert.strictEqual(foundLibCodeEntry.entry.name, 'lib');

    const foundJsCodeEntry = codeMap.findAddress(jsAddress);
    assert.notStrictEqual(foundJsCodeEntry, null);
    assert.notStrictEqual(foundJsCodeEntry.entry, null);
    assert.strictEqual(foundJsCodeEntry.entry.name, 'myScript');
  });
});
