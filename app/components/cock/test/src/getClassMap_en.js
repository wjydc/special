var i,
	fs = require('fs'),
    class_cn = require('../data/en/class.js');






fs.writeFileSync('../../data/class_en.js', 'module.exports=' + JSON.stringify(class_cn, null, 4));
