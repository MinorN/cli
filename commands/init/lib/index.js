'use strict'

const fs = require('fs')
const inquirer = require('inquirer')
const fse = require('fs-extra')
const Command = require('@minorn-cli/command')
const log = require('@minorn-cli/log')

class InitCommand extends Command {
  constructor(argv) {
    super(argv)
  }
  init() {
    this.projectName = this._argv[0] || ''
    this.force = !!this._cmd.force
    log.verbose('projectName:', this.projectName, 'force:', this.force)
  }
  async exec() {
    try {
      // 准备
      const ret = await this.prepare()
      if (ret) {
      }
      // 下载模板
      // 安装模板
    } catch (e) {
      log.error(e.message)
    }
  }

  async prepare() {
    // 当前目录是否为空
    const localPath = process.cwd()

    if (!this.IsDirEmpty(localPath)) {
      let ifContinue = false
      if (!this.force) {
        ifContinue = (
          await inquirer.prompt({
            type: 'confirm',
            name: 'ifContinue',
            message: '当前文件夹不为空，是否继续创建项目？',
            default: false,
          })
        ).ifContinue
        if (!ifContinue) {
          return
        }
      }
      if (ifContinue || this.force) {
        // 强制更新
        const { confirmDelete } = await inquirer.prompt({
          type: 'confirm',
          name: 'confirmDelete',
          message: '是否确认清空当前目录？',
          default: false,
        })
        if (confirmDelete) {
          fse.emptyDirSync(localPath)
        }
      }
    }
    // 是否是 force
    // 组件/项目
    // 获取基本信息
  }

  IsDirEmpty(localPath) {
    let fileList = fs.readdirSync(localPath)
    fileList = fileList.filter(
      (file) => !file.startsWith('.') && !['node_modules'].includes(file)
    )
    return !fileList || fileList.length <= 0
  }
}

function init(argv) {
  return new InitCommand(argv)
}

module.exports = init

module.exports.InitCommand = InitCommand
