'use strict'

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
  exec() {}
}

function init(argv) {
  return new InitCommand(argv)
}

module.exports = init

module.exports.InitCommand = InitCommand
