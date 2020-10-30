const express = require('express')
const domainRouter = express.Router()
const Domains = require('./../model/domain.model')
const { newDomain, domains } = require('./../controller/domain.Controller')(Domains)
// const { a } = require('./../controller/try.Controller')()

domainRouter.route('/').post(newDomain)
domainRouter.route('/').get(domains)
// domainRouter.route('/try').get(a)


module.exports = domainRouter