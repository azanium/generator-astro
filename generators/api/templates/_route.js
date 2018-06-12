const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/<%= apigroup %>.controller');
const validation = require('../../validations/<%= apigroup %>.validation');

const router = express.Router();

/**
 * @api {<%= method %>} api/v1/<%= apigroup %>/<%= name %> <%= name %>
 * @apiDescription <%= apidesc %>
 * @apiVersion 1.0.0
 * @apiName <%= name %>
 * @apiGroup <%= apigroup %>
 * @apiPermission public
 *
 * @apiParam  {String} code  Test Code
 *
 * @apiSuccess {Number} responseCode     HTTP Response Code
 * @apiSuccess {String} responseMessage  Response message
 * @apiSuccess {Object} response         Response object
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 */
router.route('/<%= name %>')
  .<%= method %>(validate(validation.<%= name %>), controller.<%= name %>);

module.exports = router;
