/**
* Created by TC-62 on 2015/10/26.
*/

'use strict';

import atpl from 'lib/art-template/template';
import layer from 'lib/layer/layer';

var messageView = atpl.compile(require('./view/message.tmpl'));


layer.message = function (content, icon, option) {
	var index,
	data = {
		right: content,
		icon: icon * -90 || 0
	};

	if (typeof content == 'object') {
		$.extend(data, content, { icon: content.icon * -90 || 0 });
		//option = icon
	}

	if (typeof icon == 'object') {
		option = icon
	}

	index = layer.open($.extend({
		type: 1,
		title: '系统消息',
		area: '480px',
		content: messageView({
			data: data
		})
	}, option));
	return index;
};




module.exports = window.layer = layer;
