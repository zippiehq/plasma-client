const os = require('os')
const path = require('path')

const BASE_DB_PATHS = {
  linux: `${os.homedir()}/.local/share/io.plasma.group/`,
  darwin: `${os.homedir()}/Library/Application Support/io.plasma.group/`,
  win32: '%APPDATA%\\io.plasma.group\\'
}
const BASE_DB_PATH = BASE_DB_PATHS[os.platform()]
const CHAIN_DB_PATH = path.join(BASE_DB_PATH, 'chain')

module.exports = {
  CHAIN_DB_PATH
}
