"use strict"

const Package = require("@minorn-cli/package")
const log = require("@minorn-cli/log")
const path = require("path")

const SETTINGS = {
  init: "@minorn-cli/init",
}

const CACHE_DIR = "dependencies"

async function exec() {
  let targetPath = process.env.CLI_TARGET_PATH
  let storeDir = ""
  let pkg
  const homePath = process.env.CLI_HOME_PATH
  const cmdObj = arguments[arguments.length - 1]
  const cmdName = cmdObj.name()
  const packageName = SETTINGS[cmdName]
  const packageVersion = "latest"
  if (!targetPath) {
    // 指定了targetpath
    targetPath = path.resolve(homePath, CACHE_DIR)
    storeDir = path.resolve(targetPath, "node_modules") // 缓存路径
    log.verbose("targetPath", targetPath)
    log.verbose("storeDir", storeDir)
    pkg = new Package({
      targetPath,
      storeDir,
      packageName,
      packageVersion,
    })
    if (await pkg.exists()) {
      await pkg.update()
    } else {
      await pkg.install()
    }
  } else {
    pkg = new Package({
      targetPath,
      packageName,
      packageVersion,
    })
  }
  const rootFile = pkg.getRootFilePath()
  console.log("rootFile", rootFile)
  if (rootFile) {
    require(rootFile).apply(null, Array.from(arguments))
  }
}

module.exports = exec
