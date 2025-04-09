'use strict'

const fs = require('fs')
const inquirer = require('inquirer')
const fse = require('fs-extra')
const semver = require('semver')
const Command = require('@minorn-cli/command')
const log = require('@minorn-cli/log')
const getPorjectTemplate = require('./getPorjectTemplate')

const TYPE_PROJECT = 'project'
const TYPE_COMPONENT = 'component'

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
      const projectInfo = await this.prepare()
      if (projectInfo) {
        this.projectInfo = projectInfo
        log.verbose('projectInfo', projectInfo)
        await this.downloadTemplate()
      }
      // 下载模板
      // 安装模板
    } catch (e) {
      log.error(e.message)
    }
  }

  async prepare() {
    // 判断项目模板是否存在
    const template = await getPorjectTemplate()
    console.log(template)
    if (!template || template.length <= 0) {
      throw new Error('项目模板不存在')
    }
    this.template = template
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
    return await this.getProjectInfo()
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

  async getProjectInfo() {
    function isValidName(v) {
      return /^(@[a-zA-Z0-9-_]+\/)?[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(
        v
      )
    }
    let projectInfo = {}
    // 选择创建的是项目or组件
    const { type } = await inquirer.prompt({
      type: 'list',
      message: '请选择初始化类型',
      name: 'type',
      default: TYPE_PROJECT,
      choices: [
        {
          name: '项目',
          value: TYPE_PROJECT,
        },
        {
          name: '组件',
          value: TYPE_COMPONENT,
        },
      ],
    })

    if (type === TYPE_PROJECT) {
      // 获取项目的基本信息
      const project = await inquirer.prompt([
        {
          type: 'input',
          name: 'projecrName',
          message: '请输入项目名称',
          default: '',
          validate: function (v) {
            const done = this.async()
            setTimeout(function () {
              if (!isValidName(v)) {
                done('请输入合法的项目名称')
                return
              }
              done(null, true)
            }, 0)
          },
          filter: function (v) {
            return v
          },
        },
        {
          type: 'input',
          name: 'projectVersion',
          message: '请输入项目版本号',
          default: '1.0.0',
          validate: function (v) {
            return !!semver.valid(v)
          },
          filter: function (v) {
            if (semver.valid(v)) {
              return semver.valid(v)
            }
            return v
          },
        },
      ])
      projectInfo = {
        type,
        ...project,
      }
    } else if (type === TYPE_COMPONENT) {
    }

    log.verbose('type', type)

    return projectInfo
  }

  async downloadTemplate() {
    console.log('template', this.template, this.projectInfo)
  }
}

function init(argv) {
  return new InitCommand(argv)
}

module.exports = init

module.exports.InitCommand = InitCommand
