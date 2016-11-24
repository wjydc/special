var i,
	fs = require('fs'),
    area_cn = require('../../data/area_cn.js'),
	areaEn = require('../data/en/area.json');


for (i in area_cn.raw) {
	if (areaEn[i]) {
		area_cn.raw[i] = areaEn[i];
	}
}


fs.writeFileSync('../../data/area_en.js', 'module.exports=' + JSON.stringify(area_cn, null, 4));

