"use strict"

const pkgDir = require("pkg-dir").sync
const path = require("path")
const { isObject } = require("@minorn-cli/utils")
const { formatPath } = require("@minorn-cli/format-path")

class Package {
  targetPath = null
  packageName = null
  packageVersion = null
  constructor(options) {
    if (!options) {
      throw new Error("Package 类的 options 参数不能为空")
    }
    if (!isObject(options)) {
      throw new Error("options 必须为对象")
    }
    this.targetPath = options.targetPath
    this.packageName = options.packageName
    this.packageVersion = options.packageVersion
  }

  // 判断当前pkg是否存在
  exists() {}

  install() {}

  update() {}

  getRootFilePath() {
    // 找到 package.json
    const dir = pkgDir(this.targetPath)
    if (!dir) {
      return null
    }
    // 读取 package.json
    const pkgFile = require(path.resolve(dir, "package.json"))
    if (!pkgFile || (!pkgFile.main && !pkgFile.lib)) {
      return null
    }
    // 找到main/lib
    // 路径兼容
    return formatPath(path.resolve(dir, pkgFile.main))
  }
}

module.exports = Package
