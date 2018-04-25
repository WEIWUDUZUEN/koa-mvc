'use strict'

import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import config from 'config'

mongoose.Promise = global.Promise
mongoose.connect(config.get('db'), {
  // useMongoClient: true,
  poolSize: 20
}, (err) => {
  /* istanbul ignore if */
  if (err) {
    console.error('connect to %s error: ', config.get('db'), err.message)
    process.exit(1)
  }
})

const HANDLER_PATH = path.resolve(__dirname, './')
let MODELS = {}
fs.readdirSync(HANDLER_PATH).forEach(x => {
    if (path.parse(x).name.toLocaleLowerCase() != 'index') {
        let name = path.parse(x).name
        name = name.substring(0, 1).toUpperCase() + name.substring(1)
        MODELS[name] = require(path.resolve(HANDLER_PATH, x))
    }
})

module.exports = MODELS
