'use strict';
var glmat = require("gl-matrix");
var PointLight = require("./point_light");

var ShaderProgram = function(
	gl,
	vs_text,
	fs_text,
	attribute_variables,
	uniform_variables
	//mats
) {

	this.gl = gl;

	// 頂点シェーダ
	var vs_shader = this.createShader(gl, gl.VERTEX_SHADER, vs_text);
	// ピクセルシェーダ
	var fs_shader = this.createShader(gl, gl.FRAGMENT_SHADER, fs_text);
	// プログラム
	var shader_program = this.createShaderProgram(gl, vs_shader, fs_shader);

	var i;
	// WebGL_API 09. 変数名が、シェーダ内での何番目の attribute 変数なのか取得
	var attribute_locations = {};
	for (i=0; i < attribute_variables.length; i++) {
		attribute_locations[ attribute_variables[i] ] = gl.getAttribLocation(shader_program, attribute_variables[i]);
	}

	// WebGL_API 10. 変数名が、シェーダ内での何番目の uniform 変数なのか取得
	var uniform_locations = {};
	for (i=0; i < uniform_variables.length; i++) {
		uniform_locations[ uniform_variables[i] ] = gl.getUniformLocation(shader_program, uniform_variables[i]);
	}

	// 光源用の uniform array 変数取得
	var uLight_locations = [];
	for (i=0; i<4; i++) {
		uLight_locations[i] = {};
		for (var key in new PointLight()) { // TODO: not use Pointlight object
			uLight_locations[i][key] = gl.getUniformLocation(shader_program, "uLight["+i+"]."+key);
		}
	}
	uniform_locations.uLight = uLight_locations;
	/* TODO:
	// Initialize matrices
	for (var prop in mats) {
		var size = mats[prop];
		var mat;
		switch(size) {
		case 2: mat = glmat.mat2; break;
		case 3: mat = glmat.mat3; break;
		case 4: mat = glmat.mat4; break;
		default: console.log("Invalid matrix size");
		}
		p.m[prop] = mat.create();
		mat.identity(p.m[prop]);
	}
	*/

	this.shader_program = shader_program;
	this.attribute_locations = attribute_locations;
	this.uniform_locations = uniform_locations;
};

ShaderProgram.prototype.createShader = function (gl, type, source_text) {
	if(type !== gl.VERTEX_SHADER && type !== gl.FRAGMENT_SHADER) {
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

ShaderProgram.prototype.createShaderProgram = function(gl, vertex_shader, fragment_shader) {
	// WebGL_API 05. プログラムオブジェクトの生成
	var shaderProgram = gl.createProgram();

	// WebGL_API 06. プログラムオブジェクトにシェーダを割り当てる
	gl.attachShader(shaderProgram, vertex_shader);
	gl.attachShader(shaderProgram, fragment_shader);

	// WebGL_API 07. シェーダをリンク
	gl.linkProgram(shaderProgram);

	// WebGL_API 08. シェーダのリンクが正しく行なわれたかチェック
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		throw new Error("Could not initialize shaders:\n\n" + gl.getProgramInfoLog(shaderProgram));
	}

	return shaderProgram;
};

ShaderProgram.prototype.useProgram = function() {
	// WebGL_API 19. プログラムを有効にする
	this.gl.useProgram(this.shader_program);
};

module.exports = ShaderProgram;
