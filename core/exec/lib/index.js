"use strict"

const Package = require("@minorn-cli/package")
const log = require("@minorn-cli/log")

const SETTINGS = {
  init: "@minorn-cli/init",
}

function exec() {
  let targetPath = process.env.CLI_TARGET_PATH
  const homePath = process.env.CLI_HOME_PATH
  const cmdObj = arguments[arguments.length - 1]
  const cmdName = cmdObj.name()
  const packageName = SETTINGS[cmdName]
  const packageVersion = "latest"
  if (!targetPath) {
    targetPath = "" // 缓存路径
  }
  const pkg = new Package({
    targetPath,
    packageName,
    packageVersion,
  })
  console.log(pkg.getRootFilePath())
}

module.exports = exec
