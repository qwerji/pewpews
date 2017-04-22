function Obstacle() {
    this.texture = null
    this.sprite = null
}

Obstacle.prototype.setup = function(texture, pos, stage) {
    this.texture = PIXI.loader.resources[texture].texture
    this.sprite = new PIXI.Sprite(this.texture)
    this.sprite.height = 100
    this.sprite.width = 100
    this.sprite.x = pos.x
    this.sprite.y = pos.y
    this.sprite.zIndex = 0

    stage.addChild(this.sprite)
}
