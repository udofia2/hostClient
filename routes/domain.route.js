const express = require('express')
const domainRouter = express.Router()
const Domains = require('./../model/domain.model')
const {  newDomain,index, result, } = require('./../controller/domain.Controller')(Domains)

domainRouter.route('/').post(newDomain)
//Home page
domainRouter.route('/').get(index)
//Result page
domainRouter.route('/result').get(result)

module.exports = domainRouter