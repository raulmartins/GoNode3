require('dotenv').config()
const express = require('express')
const routes = require('./routes')
const mongoose = require('mongoose')
const Sentry = require('@sentry/node')
const sentryConfig = require('./config/sentry')
const Youch = require('youch')
const validate = require('express-validation')
const databaseConfig = require('./config/database')

class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'
    this.sentry()
    this.database()
    this.middleware()
    this.routes()
    this.exception()
  }

  sentry () {
    Sentry.init(sentryConfig)
  }
  database () {
    mongoose.connect(databaseConfig.uri, {
      useCreateIndex: true,
      useNewUrlParser: true
    })
  }

  middleware () {
    this.express.use(Sentry.Handlers.requestHandler())
    this.express.use(express.json())
  }
  routes () {
    this.express.use(routes)
  }

  exception () {
    if (process.env.NODE_ENV === 'production') {
      this.express.use(Sentry.Handlers.errorHandler())
    }

    this.express.use(async (err, req, res, next) => {
      if (err instanceof validate.ValidationError) {
        return res.status(err.status).json(err)
      }
      if (process.env.NODE_ENV !== 'production') {
        const youch = new Youch(err, req)
        res.send(await youch.toJSON())
      }
      return res
        .status(err.status || 500)
        .json({ error: 'Internal Server Error' })
    })
  }
}

module.exports = new App().express
