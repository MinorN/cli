'use strict'

const semver = require('semver')
const colors = require('colors')
const log = require('@minorn-cli/log')

const LOWEST_NODE_VERSION = '12.0.0'

class Command {
  constructor(argv) {
    if (!argv) {
      throw new Error('Command 需要传入参数')
    }
    if (!Array.isArray(argv)) {
      throw new Error('Command 参数必须是数组')
    }
    if (argv.length < 1) {
      throw new Error('Command 参数长度必须大于1')
    }
    this._argv = argv
    let runner = new Promise((resolve, reject) => {
      let chain = Promise.resolve()
      chain = chain.then(() => {
        this.checkNodeVersion()
      })
      chain = chain.then(() => {
        this.initArgs()
      })
      chain = chain.then(() => {
        this.init()
      })
      chain = chain.then(() => {
        this.exec()
      })
      chain.catch((err) => {
        log.error(err.message)
      })
    })
  }
  checkNodeVersion() {
    const currentVersion = process.version
    const lowestVersion = LOWEST_NODE_VERSION
    if (!semver.gte(currentVersion, lowestVersion)) {
      throw new Error(
        colors.red(
          `minorn-cli 需要安装 v${lowestVersion} 以上版本的 Node.js,当前版本是${currentVersion}`
        )
      )
    }
  }

  initArgs() {
    this._cmd = this._argv[this._argv.length - 1]
    this._argv = this._argv.slice(0, this._argv.length - 1)
  }

  init() {
    throw new Error('init 必须实现')
  }

  exec() {
    throw new Error('exec 必须实现')
  }
}

module.exports = Command
