const express = require('express');

const router = express.Router();
const authRoutes = require('./auth.route.js');
const demoRoutes = require('./demo.route.js');
const helloRoutes = require('./hello.route.js');
const coolRoutes = require('./cool.route.js');
const luckyRoutes = require('./lucky.route.js');

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/auth', authRoutes);
router.use('/demo', demoRoutes);
router.use('/hello', helloRoutes);
router.use('/cool', coolRoutes);
router.use('/lucky', luckyRoutes);


module.exports = router;
