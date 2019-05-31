const express = require('express')
const controllers = require('./app/controllers')

const AuthMiddleware = require('./app/middlewares/auth')
const routes = express.Router()

routes.post('/users', controllers.UserController.store)
routes.post('/sessions', controllers.SessionController.store)
routes.use(AuthMiddleware)
routes.get('/ads', controllers.AdController.index)
routes.get('/ads/:id', controllers.AdController.show)
routes.post('/ads', controllers.AdController.store)
routes.put('/ads/:id', controllers.AdController.update)
routes.delete('/ads/:id', controllers.AdController.destroy)
routes.post('/purchase', controllers.PurchaseController.store)

module.exports = routes
