const express = require('express')

const drawingsRouter = express.Router()
const manageFilesRouter = require('./manage-drawings')

drawingsRouter.use('/manage-drawings', manageFilesRouter)

module.exports = drawingsRouter
