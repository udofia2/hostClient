const express = require('express')
const domainRouter = express.Router()
const Domains = require('./../model/domain.model')
const {  newDomain,index, result, } = require('./../controller/domain.Controller')(Domains)


domainRouter.route('/').post(newDomain)
domainRouter.route('/').get(index)
domainRouter.route('/result').get(result)

module.exports = domainRouter