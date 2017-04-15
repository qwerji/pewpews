function Obstacle() {
    this.texture = null
    this.sprite = null
}

Obstacle.prototype.setup = function(texture, stage) {
    this.texture = PIXI.loader.resources[texture].texture
    this.sprite = new PIXI.Sprite(this.texture)
    this.sprite.height = 100
    this.sprite.width = 100
    this.sprite.x = randomInt(0, renderer.width)
    this.sprite.y = randomInt(0, renderer.height)
    this.sprite.zIndex = 0

    stage.addChild(this.sprite)
}
