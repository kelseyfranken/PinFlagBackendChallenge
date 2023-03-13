import app from 'express'
import asyncHandler from 'express-async-handler'

import CharacterController from '../controllers/character_controller'

const routes = app.Router()

routes.get('/', asyncHandler(async (req, res) => {
    const characterController = new CharacterController();
    const result = await characterController.index(req, res);
    return result;
}));

routes.post('/', asyncHandler(async (req, res) => {
    const characterController = new CharacterController();
    const result = await characterController.create(req, res);
    return result;
}))

routes.get('/show', asyncHandler(async (req, res) => {
    const characterController = new CharacterController();
    const result = await characterController.show(req, res);
    return result;
}))


export default routes
