'use strict'

const request = require('@minorn-cli/request')

module.exports = function () {
  return request({
    url: '/project/template',
    method: 'get',
  })
}
