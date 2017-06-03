'use strict';
/*
var glmat = require("gl-matrix");
var PointLight = require("./point_light");
var worldV = require("./shader/world.vs");
var worldF = require("./shader/world.fs");
var billboardV = require("./shader/billboard.vs");
*/


var createShader = function (gl, type, source_text) {
	if(type !== gl.VERTEX_SHADER || type !== gl.FRAGMENT_SHADER) {
		throw new Error ("type must be vertex or fragment");
	}

	// WebGL_API 01. シェーダ作成
	var shader = gl.createShader(type);

	// WebGL_API 02. 生成されたシェーダにソースを割り当てる
	gl.shaderSource(shader, source_text);

	// WebGL_API 03. シェーダをコンパイルする
	gl.compileShader(shader);

	// WebGL_API 04. シェーダが正しくコンパイルされたかチェック
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw (
			(type === gl.VERTEX_SHADER ? "Vertex" : "Fragment") + " failed to compile:\n\n" + gl.getShaderInfoLog(shader));
	}

	return shader;

};

module.exports = null;
