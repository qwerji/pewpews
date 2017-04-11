function Obstacle() {
    this.texture = null
    this.sprite = null
    this.setup = (texture, stage) => {
        this.texture = PIXI.loader.resources[texture].texture
        this.sprite = new PIXI.Sprite(this.texture)
        this.sprite.height = 100
        this.sprite.width = 100
        this.sprite.x = randomInt(0, window.innerWidth)
        this.sprite.y = randomInt(0, window.innerHeight)

        stage.addChild(this.sprite)
    }
}