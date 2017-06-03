'use strict';
var base_scene = require('../hakurei').scene.base;
var CONSTANT = require('../hakurei').constant;
var util = require('../hakurei').util;

/*
var PointLight = require("./point_light");
*/
var worldV = require("../shader/world.vs");
var worldF = require("../shader/world.fs");
var billboardV = require("../shader/billboard.vs");
var ShaderProgram = require("../shader_program");






var SceneStage = function(core) {
	base_scene.apply(this, arguments);
};
util.inherit(SceneStage, base_scene);

SceneStage.prototype.init = function() {
	base_scene.prototype.init.apply(this, arguments);

	this.world_shader_program = new ShaderProgram(
		this.core.gl,
		// 頂点シェーダ／フラグメントシェーダ
		worldV, worldF,
		// attribute 変数一覧
		[
			"aPosition",
			"aTexture",
			"aNormal"
		],
		// uniform 変数一覧
		[
			"uPMatrix",
			"uMMatrix",
			"uVMatrix",
			"uSampler", // テクスチャ
			"uLightVMatrix",
			"uLightPMatrix",
			"uAmbientColor",
			"uDepthMap",
			"uLight"
		]
	);

	this.sprites_shader_program = new ShaderProgram(
		this.core.gl,
		// 頂点シェーダ／フラグメントシェーダ
		billboardV, worldF,
		// attribute 変数一覧
		[
			"aPosition",
			"aOffset",
			"aTexture",
			"aMoving",
			"aFlipped"
		],
		// uniform 変数一覧
		[
			"uCounter",
			"uCamPos",
			"uPMatrix",
			"uMMatrix",
			"uVMatrix",
			"uSampler", // テクスチャ
			"uAmbientColor",
			//"uDepthMap",
			"uLight"
		]
	);

	console.log(this.sprites_shader_program);
};

SceneStage.prototype.beforeDraw = function() {
	base_scene.prototype.beforeDraw.apply(this, arguments);
};
SceneStage.prototype.draw = function(){
};

module.exports = SceneStage;
