function Projectile() {

    this.sprite = null
    this.vx = 0
    this.vy = 0
    this.speed = 325
    this.easing = 1
    this.source = null
    this.damage = 0
    this.currentRotation = 0
    this.rotationSpeed = 45

}

Projectile.prototype.update = function() {
    this.currentRotation -= this.rotationSpeed
    this.sprite.x += this.vx * game.deltaTime
    this.sprite.y += this.vy * game.deltaTime
    this.sprite.rotation = toRadians(this.currentRotation)
}

Projectile.prototype.setup = function(direction, textureName, stage, source) {

    const originSprite = source.sprite

    this.source = source
    this.damage = 7
    this.sprite = new PIXI.Sprite(
        PIXI.loader.resources[textureName].texture
    )
    this.sprite.height = 15
    this.sprite.width = 15
    this.sprite.x = originSprite.x
    this.sprite.y = originSprite.y
    this.sprite.anchor.set(.5, .5)
    this.sprite.zIndex = 10

    switch (direction) {
        case "up":
            this.sprite.x -= this.sprite.width/3
            this.sprite.y -= originSprite.halfHeight
            this.vy = -this.speed
            break;
        case "right":
            this.sprite.rotation = toRadians(90)
            this.sprite.x += originSprite.halfWidth
            this.vx = this.speed
            break;
        case "down":
            this.sprite.rotation = toRadians(180)
            this.sprite.y += originSprite.halfHeight
            this.vy = this.speed
            break;
        case "left":
            this.sprite.rotation = toRadians(270)
            this.sprite.x -= originSprite.halfWidth
            this.vx = -this.speed
            break;
        default:
            break;
    }
    stage.addChild(this.sprite)
}
