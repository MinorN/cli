#! /usr/bin/env node

const importLocal = require('import-local')

if (importLocal(__filename)) {
  require('npmlog').info('cli', '正在使用 minorn-cli 本地版')
} else {
  require('../lib/index.js')(process.argv.slice(2))
}
