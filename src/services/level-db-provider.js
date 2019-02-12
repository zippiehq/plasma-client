const fs = require('fs')
const levelup = require('levelup')
const leveldown = require('leveldown')
const core = require('plasma-core')
const BaseDBProvider = core.providers.base.BaseDBProvider

/**
 * LevelDB wrapper.
 */
class LevelDBProvider extends BaseDBProvider {
  constructor (options) {
    super(options)

    this.dbPath = options.dbPath
    if (!fs.existsSync(this.dbPath)) {
      fs.mkdirSync(this.dbPath, { recursive: true })
    }
    this.db = levelup(leveldown(this.dbPath))
  }

  async _onStop () {
    return this.db.close()
  }

  async get (key, fallback) {
    const exists = await this.exists(key)
    if (!exists) {
      if (arguments.length === 2) {
        return fallback
      } else {
        throw new Error('Key not found in database')
      }
    }

    const result = await this.db.get(key, { asBuffer: false })
    return this._isJson(result) ? JSON.parse(result) : result
  }

  async set (key, value) {
    if (!(value instanceof String || typeof value === 'string')) {
      value = JSON.stringify(value)
    }

    return this.db.put(key, value)
  }

  async delete (key) {
    return this.db.del(key)
  }

  async exists (key) {
    try {
      await this.db.get(key)
      return true
    } catch (err) {
      if (err.notFound) {
        return false
      } else {
        throw err
      }
    }
  }

  async findNextKey (key) {
    const prefix = key.split(':')[0]
    const it = this.db.iterator({
      gte: key,
      keyAsBuffer: false,
      valueAsBuffer: false
    })

    let result = await this._itNext(it)
    while (!result.key.startsWith(prefix)) {
      result = await this._itNext(it)
    }

    return result.key
  }

  async bulkPut (objects) {
    const ops = objects.map((object) => {
      return {
        type: 'put',
        key: object.key,
        value: object.value
      }
    })
    await this.db.batch(ops)
  }

  /**
   * Promsified version of `iterator.next`.
   * @param {*} it LevelDB iterator.
   * @return {*} The key and value returned by the iterator.
   */
  async _itNext (it) {
    return new Promise((resolve, reject) => {
      it.next((err, key, value) => {
        if (err) {
          reject(err)
        }
        resolve({ key, value })
      })
    })
  }
}

module.exports = LevelDBProvider
