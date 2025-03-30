'use strict'

const Package = require('@minorn-cli/package')
const log = require('@minorn-cli/log')
const path = require('path')
const cp = require('child_process')

const SETTINGS = {
  init: '@minorn-cli/init',
}

const CACHE_DIR = 'dependencies'

async function exec() {
  let targetPath = process.env.CLI_TARGET_PATH
  let storeDir = ''
  let pkg
  const homePath = process.env.CLI_HOME_PATH
  const cmdObj = arguments[arguments.length - 1]
  const cmdName = cmdObj.name()
  const packageName = SETTINGS[cmdName]
  const packageVersion = 'latest'
  if (!targetPath) {
    // 指定了targetpath
    targetPath = path.resolve(homePath, CACHE_DIR)
    storeDir = path.resolve(targetPath, 'node_modules') // 缓存路径
    log.verbose('targetPath', targetPath)
    log.verbose('storeDir', storeDir)
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
  if (rootFile) {
    try {
      // 在node子进程中调用
      const args = Array.from(arguments)
      const cmd = args[args.length - 1]
      const o = Object.create(null)
      Object.keys(cmd).forEach((key) => {
        if (
          cmd.hasOwnProperty(key) &&
          !key.startsWith('_') &&
          key !== 'parent'
        ) {
          o[key] = cmd[key]
        }
      })
      args[args.length - 1] = o
      const code = `require('${rootFile}').call(null,${JSON.stringify(args)})`
      const child = cp.spawn('node', ['-e', code], {
        cwd: process.cwd(),
        stdio: 'inherit',
      })
      child.on('error', (e) => {
        log.error(e.message)
        proceess.exit(1)
      })
      child.on('exit', (e) => {
        console.log('命令执行成功')
        process.exit(e)
      })
      // require(rootFile).call(null, Array.from(arguments))
    } catch (e) {
      log.error(e.message)
      log.verbose(e)
    }
  }
}

module.exports = exec
