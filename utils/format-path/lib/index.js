"use strict"

const path = require("path")

function formatPath(p) {
  if (!p) {
    return p
  }
  const sep = path.sep // mac:/ windows:\
  if (sep === "/") {
    return p
  } else {
    return p.replace(/\\/g, "/")
  }
}

module.exports = { formatPath }
