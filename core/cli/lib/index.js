"use strict"

module.exports = core

const semver = require("semver")
const log = require("@minorn-cli/log")
const colors = require("colors")
const userHome = require("user-home")
const pathExists = require("path-exists").sync
const pkg = require("../package.json")
const constant = require("./const")

let args

function core() {
  try {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
    checkInputArgs()
    log.verbose("debug", "test debug")
  } catch (e) {
    log.error(e.message)
  }
}

// 检查版本号
function checkPkgVersion() {
  log.notice("cli", pkg.version)
}

function checkNodeVersion() {
  const currentVersion = process.version
  const lowestVersion = constant.LOWEST_NODE_VERSION
  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(
      colors.red(
        `minorn-cli 需要安装 v${lowestVersion} 以上版本的 Node.js,当前版本是${currentVersion}`
      )
    )
  }
}

// 检查 root 账户启动，如果是 root 降级处理(mac)
function checkRoot() {
  require("root-check")()
}

// 判断用户主目录是否存在
function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red("当前登录用户主目录不存在"))
  }
}

// 检查入参
function checkInputArgs() {
  const minimist = require("minimist")
  args = minimist(process.argv.slice(2))
  checkArgs()
}
function checkArgs() {
  if (args.debug) {
    process.env.LOG_LEVEL = "verbose"
  } else {
    process.env.LOG_LEVEL = "info"
  }
  log.level = process.env.LOG_LEVEL
}
