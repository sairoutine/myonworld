'use strict';
var base_scene = require('../hakurei').scene.base;
var CONSTANT = require('../hakurei').constant;
var util = require('../hakurei').util;
var glmat = require("gl-matrix");

var PointLight = require("../point_light");
var worldV = require("../shader/world.vs");
var worldF = require("../shader/world.fs");
var billboardV = require("../shader/billboard.vs");
var ShaderProgram = require("../shader_program");
var Player = require("../player");






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
		// attribute 変数一覧(頂点毎に異なるデータ)
		[
			"aPosition",
			"aTexture",
			"aNormal"
		],
		// uniform 変数一覧(頂点毎に同じデータ)
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
		// attribute 変数一覧(頂点毎に異なるデータ)
		[
			"aPosition",
			"aOffset",
			"aTexture",
			"aMoving",
			"aFlipped"
		],
		// uniform 変数一覧(頂点毎に同じデータ)
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

	this.player = new Player(this.core.gl, this.core.image_loader.getImage("player"));

	var light_color       = [1.0, 0.5, 0.0];
	var light_position    = [0,0,1];
	var light_attenuation = [0.3, 0.1, 0.05];
	this.player_light = new PointLight(light_color, light_position, light_attenuation);
};

SceneStage.prototype.beforeDraw = function() {
	base_scene.prototype.beforeDraw.apply(this, arguments);

	this.player.update();
	this.player_light.update();

	// ライトはプレイヤーの今いる位置を照らす
	this.player_light.moveToPlayer(this.player);
};

SceneStage.prototype.draw = function() {
	// WebGL_API 20. 画面をクリア
	this.core.gl.clearColor.apply(this.core.gl, [0.0, 0.0, 0.0, 1.0]); // 真っ黒
	this.core.gl.clear(this.core.gl.COLOR_BUFFER_BIT|this.core.gl.DEPTH_BUFFER_BIT); // 画面上の色をクリア + 深度バッファクリア

	//this.core.gl.viewport(0, 0, this.core.width, this.core.height);
	//glmat.mat4.perspective(this.data.world.m.pMatrix, 45.0, this.core.width/this.core.height, 0.1, 100.0);

	this.renderPlayer();

	// WebGL_API 29. 描画
	this.core.gl.flush();

};

SceneStage.prototype.renderPlayer = function() {
	//this.core.gl.disable(this.core.gl.CULL_FACE);

	// プログラムオブジェクトを有効にする
	this.sprites_shader_program.useProgram();


	//this.data.world.m.vMatrix = this.camera.matrix;
	//this.sprites.sprites[0].theta = this.camera.theta[2];
	var camera_matrix = glmat.mat4.create();
	glmat.mat4.identity(camera_matrix);

	// WebGL_API 21. uniform 変数にデータを登録する
	// 4fv -> vec4, 3fv -> vec3, 1f -> float
	//this.core.gl.uniformMatrix4fv(this.sprites_shader_program.uniform_locations.uMMatrix, false, null);
	this.core.gl.uniformMatrix4fv(this.sprites_shader_program.uniform_locations.uVMatrix, false, camera_matrix);
	//this.core.gl.uniformMatrix4fv(this.sprites_shader_program.uniform_locations.uPMatrix, false, null);

	this.core.gl.uniform1f(this.sprites_shader_program.uniform_locations.uCounter, false, this.frame_count);
	//this.core.gl.uniform3fv(this.data.sprites.u.AmbientColor, this.level.ambient);
	//this.core.gl.uniform3fv(this.data.sprites.u.CamPos, this.camera.pos);
	this.updatePlayerLight();

	// attribute 変数にデータを登録する
	this.attribSetup(this.sprites_shader_program.uniform_locations.aPosition, this.player.vertexObject,  3);
	this.attribSetup(this.sprites_shader_program.uniform_locations.aTexture,  this.player.texCoordObject,2);
	this.attribSetup(this.sprites_shader_program.uniform_locations.aOffset,   this.player.offsetObject,  3);
	this.attribSetup(this.sprites_shader_program.uniform_locations.aMoving,   this.player.movingObject,  1);
	this.attribSetup(this.sprites_shader_program.uniform_locations.aFlipped,  this.player.flippedObject, 1);

	// TODO: player.bindTexture() に移動
	// WebGL_API 25. 有効にするテクスチャユニットを指定(今回は0)
	this.core.gl.activeTexture(this.core.gl.TEXTURE0);
	// WebGL_API 26. テクスチャをバインドする
	this.core.gl.bindTexture(this.core.gl.TEXTURE_2D, this.player.texture);
	// WebGL_API 27. テクスチャデータをシェーダに送る(ユニット 0)
	this.core.gl.uniform1i(this.sprites_shader_program.uniform_locations.uSampler, 0);

	// WebGL_API 28. 送信
	this.core.gl.bindBuffer(this.core.gl.ELEMENT_ARRAY_BUFFER, this.player.indexObject);
	this.core.gl.drawElements(this.core.gl.TRIANGLES, this.player.numVertices(), this.core.gl.UNSIGNED_SHORT, 0);
};

SceneStage.prototype.attribSetup = function(attribute_location, buffer_object, size, type) {
	if (!type) {
		type = this.core.gl.FLOAT;
	}

	// WebGL_API 22. attribute 属性を有効にする
	this.core.gl.enableVertexAttribArray(attribute_location);

	// WebGL_API 23. 頂点バッファをバインドする
	this.core.gl.bindBuffer(this.core.gl.ARRAY_BUFFER, buffer_object);
	// WebGL_API 24. attribute 属性を登録する(1頂点の要素数、型を登録)
	this.core.gl.vertexAttribPointer(attribute_location, size, type, false, 0, 0);
};

SceneStage.prototype.updatePlayerLight = function(){
	this.core.gl.uniform3fv(this.sprites_shader_program.uniform_locations.uLight[0].attenuation, this.player_light.attenuation);
	this.core.gl.uniform3fv(this.sprites_shader_program.uniform_locations.uLight[0].color, this.player_light.color);
	this.core.gl.uniform3fv(this.sprites_shader_program.uniform_locations.uLight[0].position, this.player_light.position);
};











module.exports = SceneStage;
