const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/<%= apigroup %>.controller');

const {
  <%= name %>,
} = require('../../validations/<%= apigroup %>.validation');

const router = express.Router();

/**
 * @api {<%= method %>} api/v1/<%= apigroup %>/<%= name %> <%= name %>
 * @apiDescription <%= apidesc %>
 * @apiVersion 1.0.0
 * @apiName <%= name %>
 * @apiGroup <%= apigroup %>
 * @apiPermission public
 *
 * @apiParam  {String} <PARAM>  <PARAM DESCRIPTION>
 *
 * @apiSuccess (Created 200) {String} <MESSAGE>  <MESSAGE DESCRIPTION>
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 */
router.route('/<%= name %>')
  .<%= method %>(validate(<%= name %>), controller.<%= name %>);

module.exports = router;
