"use strict"

const pkgDir = require("pkg-dir").sync
const path = require("path")
const npminstall = require("npminstall")
const fse = require("fs-extra")
const pathExists = require("path-exists").sync
const { isObject } = require("@minorn-cli/utils")
const { formatPath } = require("@minorn-cli/format-path")
const {
  getDefaultRegistry,
  getNpmLatestVersion,
} = require("@minorn-cli/get-npm-info")

class Package {
  constructor(options) {
    if (!options) {
      throw new Error("Package 类的 options 参数不能为空")
    }
    if (!isObject(options)) {
      throw new Error("options 必须为对象")
    }
    this.targetPath = options.targetPath // 依赖路径
    this.storeDir = options.storeDir // 缓存 pkg 路径
    this.packageName = options.packageName
    this.packageVersion = options.packageVersion
    this.cacheFilePathPrefix = this.packageName.replace("/", "_") // 以名称作为前缀
  }

  async prepare() {
    if (this.storeDir && !pathExists(this.storeDir)) {
      fse.mkdirpSync(this.storeDir)
    }
    if (this.packageName === "latest") {
      this.packageVersion = await getNpmLatestVersion(this.packageName)
    }
  }

  get cacheFilePath() {
    return path.resolve(
      this.storeDir,
      `_${this.cacheFilePathPrefix}@${this.packageVersion}@${this.packageName}`
    )
  }

  // 判断当前pkg是否存在
  async exists() {
    if (this.storeDir) {
      await this.prepare()
      return pathExists(this.cacheFilePath)
    } else {
      return pathExists(this.targetPath)
    }
  }

  async install() {
    await this.prepare()
    return npminstall({
      root: this.targetPath,
      storeDir: this.storeDir,
      register: getDefaultRegistry(),
      pkgs: [{ name: this.packageName, version: this.packageVersion }],
    })
  }

  getCacheFilePath(version) {
    path.resolve(
      this.storeDir,
      `_${this.cacheFilePathPrefix}@${version}@${this.packageName}`
    )
  }

  async update() {
    await this.prepare()
    const latestVersion = await getNpmLatestVersion(this.packageName)
    const latestFilePath = this.getCacheFilePath(latestVersion)
    if (!pathExists(latestFilePath)) {
      await npminstall({
        root: this.targetPath,
        storeDir: this.storeDir,
        register: getDefaultRegistry(),
        pkgs: [{ name: this.packageName, version: latestVersion }],
      })
      this.packageVersion = latestVersion
    }
  }

  getRootFilePath() {
    function _getRootFile(targetPath) {
      // 找到 package.json
      const dir = pkgDir(targetPath)
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
    if (this.storeDir) {
      return _getRootFile(this.cacheFilePath)
    } else {
      // 不使用缓存
      return _getRootFile(this.targetPath)
    }
  }
}

module.exports = Package
