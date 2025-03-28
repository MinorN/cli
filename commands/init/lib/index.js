'use strict'

const Command = require('@minorn-cli/command')

class InitCommand extends Command {
  constructor(argv) {
    super(argv)
  }
}

function init(argv) {
  return new InitCommand(argv)
}

module.exports = init

module.exports.InitCommand = InitCommand
