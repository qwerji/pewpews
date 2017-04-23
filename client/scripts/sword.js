function Sword(){
    this.sprite = null
    this.vx = 0
    this.vy = 0
    this.speed = 900
    this.source = null
    this.damage = 0
    this.carrier = null
    this.verticalSprite = null
    this.horizontalSprite = null
    this.sprite = null
    this.xOff = 40
    this.yOff = -30
}

Sword.prototype.equippedBy = function(player) {
    this.carrier = player
}

Sword.prototype.throw = function(direction) {

    if(this.carrier) {
        this.carrier.sword = null
    } else {
        return
    }
    
    this.setSprite(direction)

    switch (direction) {
        case "up":
            this.vy = -this.speed
            this.sprite.x = this.carrier.sprite.x
            this.sprite.y = this.carrier.sprite.y - this.carrier.sprite.halfHeight
            break
        case "right":
            this.vx = this.speed
            this.sprite.x = this.carrier.sprite.x + this.carrier.sprite.halfWidth
            this.sprite.y = this.carrier.sprite.y
            break
        case "down":
            this.vy = this.speed
            this.sprite.x = this.carrier.sprite.x
            this.sprite.y = this.carrier.sprite.y + this.carrier.sprite.halfHeight
            break
        case "left":
            this.vx = -this.speed
            this.sprite.x = this.carrier.sprite.x - this.carrier.sprite.halfWidth
            this.sprite.y = this.carrier.sprite.y
            break
        default:
            break
    }
}

Sword.prototype.drop = function() {
    this.vx = 0
    this.vy = 0
    this.carrier = null
}

Sword.prototype.update = function() {
    this.sprite.x += this.vx * game.deltaTime
    this.sprite.y += this.vy * game.deltaTime
}

Sword.prototype.setup = function(pos, textureName, stage) {
    this.damage = 100
    this.verticalSprite = new PIXI.Sprite(
        PIXI.loader.resources[textureName].texture
    )
    this.horizontalSprite = new PIXI.Sprite(
        PIXI.loader.resources[textureName + 'h'].texture
    )
    this.sprite = this.verticalSprite
    this.sprite.height = 80
    this.sprite.width = 26
    this.sprite.x = pos.x
    this.sprite.y = pos.y
    this.sprite.anchor.set(.5, .5)
    this.sprite.zIndex = 10

    this.horizontalSprite.height = this.sprite.width
    this.horizontalSprite.width = this.sprite.height
    this.horizontalSprite.x = this.sprite.x
    this.horizontalSprite.y = this.sprite.y
    this.horizontalSprite.anchor.set(.5, .5)
    this.horizontalSprite.zIndex = this.sprite.zIndex

    stage.addChild(this.sprite)
}

Sword.prototype.setSprite = function(orientation) {
    stage.removeChild(this.sprite)

    switch (orientation) {
        case "up":
            this.sprite = this.verticalSprite
            this.sprite.rotation = toRadians(0)
            break
        case "right":
            this.sprite = this.horizontalSprite
            this.sprite.rotation = toRadians(0)
            break
        case "down":
            this.sprite = this.verticalSprite
            this.sprite.rotation = toRadians(180)
            break
        case "left":
            this.sprite = this.horizontalSprite
            this.sprite.rotation = toRadians(-180)
            break
        default:
            break
    }

    stage.addChild(this.sprite)
}
