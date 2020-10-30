const express = require('express')
const domainRouter = express.Router()
const Domains = require('./../model/domain.model')
const { newDomain, domains, display } = require('./../controller/domain.Controller')(Domains)
// const { a } = require('./../controller/try.Controller')()

domainRouter.route('/hit').get(display)
domainRouter.route('/').post(newDomain)
domainRouter.route('/').get(domains)


module.exports = domainRouter