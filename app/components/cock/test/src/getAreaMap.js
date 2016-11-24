var fs = require('fs'),
    area = require('../data/cn/area.json'),
    areaAll = require('../data/cn/area-all.json'),
    areaHot = require('../data/cn/area-hot.json'),
    //areaEmp = require('../data/cn/area-emp.json'),
    map = {
        raw: area,
        a_ll: areaAll,
        hot: areaHot
        //emp: areaEmp
    },
    i, len, tmp1, tmp2;


// hot 列的 col 总值
map.h_col = [];
for (i = 0, len = map.hot.length; i < len; i++) {
    tmp1 = map.hot[i][1].length;
    tmp2 = map.h_col[i % 2] || 0;
    map.h_col[i % 2] = tmp1 > tmp2 ? tmp1 : tmp2;
}


fs.writeFileSync('../../data/area_cn.js', 'module.exports=' + JSON.stringify(map, null, 4));

