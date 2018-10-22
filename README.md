# tick-processor

<!-- markdownlint-disable MD013 -->
[![Build Status](https://secure.travis-ci.org/dex4er/js-tick-processor.svg)](http://travis-ci.org/dex4er/js-tick-processor) [![npm](https://img.shields.io/npm/v/tick-processor.svg)](https://www.npmjs.com/package/tick-processor)
<!-- markdownlint-enable MD013 -->

V8 tick processor that can be run with Node.js

See <https://v8.dev/docs/profile> for details.

This package contains original tick processor from V8 v7.0.276.28.

## Requirements

This module requires Node >= 8 and `nm` command installed in system.

## Installation

```shell
npm install tick-processor
```

## Example

Generate profiling data:

```console
node --prof script.js
```

Preprocess profiling data:

```console
tick-process --preprocess isolate-0x123456-v8.log > isolate-0x123456-v8.json
```

Run GUI for profiling data:

Download files from <https://github.com/v8/v8/blob/master/tools/profview/> and
run in the browser.

## License

Copyright (c) 2018 Piotr Roszatycki <piotr.roszatycki@gmail.com>

[MIT](https://opensource.org/licenses/MIT)

Contains files from V8 project:

Copyright 2009, 2011, 2012, 2013, 2017 the V8 project authors

[BSD-3-Clause](https://opensource.org/licenses/BSD-3-Clause)
