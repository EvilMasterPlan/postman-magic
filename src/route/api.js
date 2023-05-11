var express = require('express');
var router = express.Router();

const common = require('../util/common.js');

// =============================================
// "magic curl" feature, various versions
// =============================================

router.post('/magic/curl/v1', [
	common.body(['query']),
	common.return
]);

module.exports = router;
