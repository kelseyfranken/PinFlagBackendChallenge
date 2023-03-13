import app from 'express'

import Home from './home_routes'
import Character from './character_routes'

const routes = app.Router()

routes.use('/', Home)
routes.use('/character', Character)

export default routes
