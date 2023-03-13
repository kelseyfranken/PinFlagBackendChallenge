import BaseController from './base'

export default class HomeController extends BaseController {
  HomeController () {}

  get (req, res) {
    return super.Success(res, { message: 'Hello World!' })
  }
}
