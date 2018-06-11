const express = require('express');

const router = express.Router();

/**
 * GET <%= apiversion %>/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET <%= apiversion %>/docs
 */
router.use('/docs', express.static('docs'));


module.exports = router;
