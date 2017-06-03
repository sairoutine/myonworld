'use strict';
var base_scene = require('../hakurei').scene.base;
var CONSTANT = require('../hakurei').constant;
var util = require('../hakurei').util;

var SceneStage = function(core) {
	base_scene.apply(this, arguments);
};
util.inherit(SceneStage, base_scene);

SceneStage.prototype.init = function() {
	base_scene.prototype.init.apply(this, arguments);
};

SceneStage.prototype.beforeDraw = function() {
	base_scene.prototype.beforeDraw.apply(this, arguments);
};
SceneStage.prototype.draw = function(){
};

module.exports = SceneStage;
