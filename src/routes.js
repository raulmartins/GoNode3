const express = require('express')
const controllers = require('./app/controllers')
const validate = require('express-validation')
const validators = require('./app/validators')
const expressAsyncHandler = require('express-async-handler')
const AuthMiddleware = require('./app/middlewares/auth')
const routes = express.Router()

routes.post(
  '/users',
  validate(validators.User),
  expressAsyncHandler(controllers.UserController.store)
)
routes.post(
  '/sessions',
  validate(validators.Session),
  expressAsyncHandler(controllers.SessionController.store)
)

routes.use(AuthMiddleware)

routes.get('/ads', expressAsyncHandler(controllers.AdController.index))
routes.get('/ads/:id', expressAsyncHandler(controllers.AdController.show))
routes.delete('/ads/:id', expressAsyncHandler(controllers.AdController.destroy))
routes.post(
  '/ads',
  validate(validators.Ad),
  expressAsyncHandler(controllers.AdController.store)
)
routes.put(
  '/ads/:id',
  validate(validators.Ad),
  expressAsyncHandler(controllers.AdController.update)
)
routes.post(
  '/purchase',
  validate(validators.Purchase),
  expressAsyncHandler(controllers.PurchaseController.store)
)
routes.get(
  '/purchase',
  expressAsyncHandler(controllers.PurchaseController.index)
)
routes.get(
  '/purchase/:id',
  expressAsyncHandler(controllers.PurchaseController.sold)
)

module.exports = routes
