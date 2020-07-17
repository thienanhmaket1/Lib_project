const express = require('express')

const apiRouter = express.Router()
const authenRouter = require('./authen/index')

const filesRouter = require('./files')
const foldersRouter = require('./folders')
const settingsRouter = require('./settings')
const usersRouter = require('./users')
const messagesRouter = require('./messages')
const drawingsRouter = require('./drawings')

const middleWares = require('../../middlewares')

apiRouter.use('/authen', authenRouter)

apiRouter.post('/*', middleWares.permissionsMiddleWare.authenMiddleware)

apiRouter.use('/files', filesRouter)
apiRouter.use('/folders', foldersRouter)
apiRouter.use('/settings', settingsRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/messages', messagesRouter)
apiRouter.use('/drawings', drawingsRouter)

module.exports = apiRouter
