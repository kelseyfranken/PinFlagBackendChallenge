const _processResponse = (data) => {
  if (Array.isArray(data) || (typeof (data) === 'object' && data !== null)) return data
  if (data !== undefined && data !== null) return { message: data }
  return undefined
}

export default class BaseController {
  Success (res, data) { return res.status(200).json(_processResponse(data)) }
  ErrorBadRequest (res, error) { return res.status(400).json(_processResponse(error)) }
  InternalError (res, error) { return res.status(500).json(_processResponse(error)) }
  NotFound (res, error) { return res.status(404).json(_processResponse(error)) }
}
