function Wall() {
    this.sprite = null
}

Wall.prototype.setup = function(texture, type, stage) {
    
    this.sprite = new PIXI.extras.TilingSprite(
        PIXI.loader.resources[texture].texture
    )

    this.sprite.zIndex = 0

    switch (type) {
        case 'left':
            this.sprite.height = renderer.height
            this.sprite.width = 100
            this.sprite.x = this.sprite.width/2
            this.sprite.y = renderer.height/2
            break
        case 'right':
            this.sprite.height = renderer.height
            this.sprite.width = 100
            this.sprite.x = renderer.width - this.sprite.width/2
            this.sprite.y = renderer.height/2
            break
        case 'top':
            this.sprite.height = 100
            this.sprite.width = renderer.width
            this.sprite.x = renderer.width/2
            this.sprite.y = this.sprite.height/2
            break
        case 'bottom':
            this.sprite.height = 100
            this.sprite.width = renderer.width
            this.sprite.x = renderer.width/2
            this.sprite.y = renderer.height - this.sprite.height/2
            break
        default:
            break
    }

    this.sprite.anchor.set(.5, .5)
    
    stage.addChild(this.sprite)
}
