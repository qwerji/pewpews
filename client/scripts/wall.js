function Wall() {
    this.sprite = null
}

Wall.prototype.setup = function(texture, type, stage) {
    
    this.sprite = new PIXI.extras.TilingSprite(
        PIXI.loader.resources[texture].texture
    )

    switch (type) {
        case 'left':
            this.sprite.zIndex = -10
            this.sprite.height = renderer.height// - statusBarOffset
            this.sprite.width = 50
            this.sprite.x = this.sprite.width/2
            this.sprite.y = (renderer.height/2) - statusBarOffset
            break
        case 'right':
            this.sprite.zIndex = -11
            this.sprite.height = renderer.height// - statusBarOffset
            this.sprite.width = 50
            this.sprite.x = renderer.width - this.sprite.width/2
            this.sprite.y = (renderer.height/2) - statusBarOffset
            break
        case 'top':
            this.sprite.zIndex = -12
            this.sprite.height = 50
            this.sprite.width = renderer.width
            this.sprite.x = renderer.width/2
            this.sprite.y = this.sprite.height/2
            break
        case 'bottom':
            this.sprite.zIndex = -13
            this.sprite.height = 50
            this.sprite.width = renderer.width
            this.sprite.x = renderer.width/2
            this.sprite.y = renderer.height - (this.sprite.height/2) - statusBarOffset
            break
        default:
            break
    }

    this.sprite.anchor.set(.5, .5)
    
    stage.addChild(this.sprite)
}
