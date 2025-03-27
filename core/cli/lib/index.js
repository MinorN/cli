"use strict"

module.exports = core

const path = require("path")
const semver = require("semver")
const log = require("@minorn-cli/log")
const colors = require("colors")
const userHome = require("user-home")
const pathExists = require("path-exists").sync
const pkg = require("../package.json")
const constant = require("./const")

let args, config

async function core() {
  try {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
    checkInputArgs()
    checkEnv()
    await checkGlobalUpdate()
    log.verbose("debug", "已经进入verbose模式")
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

// 检查环境变量
function checkEnv() {
  const dotEnv = require("dotenv")
  const dotEnvPath = path.resolve(userHome, ".env")
  if (pathExists(dotEnvPath)) {
    config = dotEnv.config({
      path: dotEnvPath,
    })
  } else {
    createDefaultConfig()
  }
  log.verbose("env", process.env.CLI_HOME_PATH)
}
function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  }
  if (process.env.CLI_HOME) {
    cliConfig["cliHome"] = path.join(userHome, process.env.CLI_HOME)
  } else {
    cliConfig["cliHome"] = path.join(userHome, constant.DEFAULT_CLI_HOME)
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome
}

// 检查是否需要更新
async function checkGlobalUpdate() {
  const currentVersion = pkg.version
  const npmName = pkg.name
  const { getNpmInfo } = require("@minorn-cli/get-npm-info")
  const data = await getNpmInfo(npmName)
  console.log(data)
}
