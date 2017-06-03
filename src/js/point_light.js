'use strict';
var PointLight = function(color, position, attenuation) {
	// 色
	this.color = color ? color : [1.0, 1.0, 1.0];
	// 位置
	this.position = position ? position : [0.0, 0.0, 0.0];
	// 減衰
	this.attenuation = attenuation ? attenuation : [0.5, 0.1, 0.0];

	this.frame = 0;
};
PointLight.prototype.update = function() {
	// ライトの光を時間に応じて色に変化をつける
	for (var i=0; i<3; i++) {
		this.color[i] += Math.sin(0.0005*this.frame*180/Math.PI)*0.002;
	}

	this.frame++;
};
PointLight.prototype.moveToPlayer = function(player) {
	// ライトはプレイヤーの今いる位置を照らす
	this.position = player.position.slice(0);
	this.position[2] += 2; // ライトのZ 軸を少し上に
};



module.exports = PointLight;
