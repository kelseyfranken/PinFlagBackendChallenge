import express from 'express'

import './config/environment'
import routes from './routes'
import './models'
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs.json');

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use('/', routes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const startServer = () => {
  app.listen(port, () => {
    console.log(`API running on http://127.0.0.1:${port}/`)
  })
}

startServer()
export { app };