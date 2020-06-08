import express from 'express';
import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'

const routes = express.Router()

routes.get('/items', ItemsController.index)

routes.post('/points', PointsController.create)

export default routes