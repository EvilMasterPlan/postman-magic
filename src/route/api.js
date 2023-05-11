var express = require('express');
var router = express.Router();

const magic = require('../magic/magic.js');
const common = require('../util/common.js');

// =============================================
// "magic curl" feature, various versions
// =============================================

router.post('/magic/curl/v1', [
	common.body(['query']),
	magic.curl_v1,
	common.return
]);

module.exports = router;
