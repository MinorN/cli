'use strict'

const semver = require('semver')
const colors = require('colors')

const LOWEST_NODE_VERSION = '26.0.0'

class Command {
  constructor(argv) {
    this._argv = argv
    let runner = new Promise((resolve, reject) => {
      let chain = Promise.resolve()
      chain = chain.then(() => {
        this.checkNodeVersion()
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

  init() {
    throw new Error('init 必须实现')
  }

  exec() {
    throw new Error('exec 必须实现')
  }
}

module.exports = Command
