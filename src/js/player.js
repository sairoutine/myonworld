'use strict';

/* 自機 */

var Player = function(gl, image) {
	this.gl = gl;

	// テクスチャを作成
	this.texture = this.createTexture(gl, image);

	this.vertices = [];
	// テクスチャ座標
	this.texCoords = [];
	this.offsets = [];
	this.indices = [];
	this.moving = [];
	this.flipped = [];

	this.baseIndex = 0;

	// WebGL_API 16. 頂点バッファを作成
	this.vertexObject   = gl.createBuffer();
	this.texCoordObject = gl.createBuffer();
	this.offsetObject   = gl.createBuffer();
	this.indexObject    = gl.createBuffer();
	this.movingObject   = gl.createBuffer();
	this.flippedObject  = gl.createBuffer();

	this.createParam();
};

Player.prototype.update = function() {
	/* TODO:
	var i;
	for (i=0; i<this.sprites.length; i++) {
		this.moveSprite(i,this.sprites[i].pos);
		this.flipSprite(i,this.sprites[i].flipped);
	}
	*/

	// WebGL_API 17. 頂点バッファをバインド
	// WebGL_API 18. 頂点バッファにデータをセットする
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexObject);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);

	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texCoordObject);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.texCoords), this.gl.STATIC_DRAW);

	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.offsetObject);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.offsets), this.gl.STATIC_DRAW);

	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.movingObject);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.moving), this.gl.STATIC_DRAW);

	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.flippedObject);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.flipped), this.gl.STATIC_DRAW);

	this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexObject);
	this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);

	// 頂点バッファのバインドをクリア
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

	/* TODO:
	for (i=0; i<this.sprites.length; i++) {
		this.sprites[i].moving = 0;
	}
	*/
};

Player.prototype.createParam = function() {

	var pos = [0,0,0];

	/* 1--0
	   |  |
	   2--3 */
	var object = [
		[ 0.5, 0.0, 1.0],
		[-0.5, 0.0, 1.0],
		[-0.5, 0.0, 0.0],
		[ 0.5, 0.0, 0.0]
	];

	var texture_st = [
		[1.0, 0.0],
		[0.0, 0.0],
		[0.0, 1.0],
		[1.0, 1.0]
	];

	for (var i=0; i<4; i++) {
		this.vertices  = this.vertices.concat(pos);
		this.offsets   = this.offsets.concat(object[i]);
		this.texCoords = this.texCoords.concat(texture_st[i]);
		this.moving.push(0);
		this.flipped.push(0);
	}

	this.indices.push(
		this.baseIndex, this.baseIndex+1, this.baseIndex+2,
		this.baseIndex, this.baseIndex+2, this.baseIndex+3
	);
	this.baseIndex += 4;
};

Player.prototype.createTexture = function(gl, image) {
	// WebGL_API 11. テクスチャを作成
	var texture = gl.createTexture();

	// WebGL_API 12. 頂点バッファをバインドする
	gl.bindTexture(gl.TEXTURE_2D, texture);
	// WebGL_API 13. テクスチャへイメージを適用
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	// WebGL_API 14. ミップマップを生成
	gl.generateMipmap(gl.TEXTURE_2D);

	// WebGL_API 15. テクスチャパラメータの設定
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); //テクスチャが縮小される際の補間方法
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); //テクスチャが拡大される際の補間方法
	gl.bindTexture(gl.TEXTURE_2D, null);

	return texture;
};

Player.prototype.numVertices = function() {
	return this.indices.length;
};






/*
Player.prototype.flipSprite = function(spriteId, flipped) {
	for (var i=0; i<4; i++) {
		this.flipped[spriteId*4+i] = this.sprites[spriteId].flipped;
	}
};

Player.prototype.moveSprite = function(spriteId, pos) {
	for (var i=0; i<4; i++) {
		this.moving[spriteId*4+i] = this.sprites[spriteId].moving;
		for (var j=0; j<3; j++) 
			this.vertices[spriteId*12+i*3+j] = pos[j];
	}
};

Player.prototype.offsetSprite = function(spriteId, d) {
	for (var i=0; i<4; i++) 
		for (var j=0; j<3; j++) 
			this.vertices[spriteId*4+i*3+j] += d[j];
};
*/


module.exports = Player;
