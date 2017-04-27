function Sword() {
    this.vx = 0
    this.vy = 0
    this.speed = 900
    this.source = null
    this.damage = 25
    this.carrier = null
    this.verticalSprite = null
    this.horizontalSprite = null
    this.sprite = null
    this.xOff = 40
    this.yOff = -30
    this.throws = 5
    this.totalThrows = 5
    this.bounces = 4
    this.totalBounces = 4
    this.spawnPoint = null
    this.respawnTime = 5000
    this.easing = 0.6
    this.initialDirection = null
}

Sword.prototype.equippedBy = function(player) {
    this.carrier = player
}

Sword.prototype.throw = function(direction) {
    //if(!this.carrier) return
    
    this.carrier.sword = null
    
    this.setSprite(direction)
    if(this.throws){
        this.throws -= 1
    }
    switch (direction) {
        case "up":
            this.initialDirection = "vertical"
            this.vx = this.carrier.vx
            this.vy = -this.speed + this.carrier.vy
            this.sprite.x = this.carrier.sprite.x
            this.sprite.y = this.carrier.sprite.y - this.carrier.sprite.halfHeight
            break
        case "right":
            this.initialDirection = "horizontal"
            this.vx = this.speed + this.carrier.vx
            this.vy = this.carrier.vy
            this.sprite.x = this.carrier.sprite.x + this.carrier.sprite.halfWidth
            this.sprite.y = this.carrier.sprite.y
            break
        case "down":
            this.initialDirection = "vertical"
            this.vx = this.carrier.vx
            this.vy = this.speed + this.carrier.vy
            this.sprite.x = this.carrier.sprite.x
            this.sprite.y = this.carrier.sprite.y + this.carrier.sprite.halfHeight
            break
        case "left":
            this.initialDirection = "horizontal"
            this.vx = -this.speed + this.carrier.vx
            this.vy = this.carrier.vy
            this.sprite.x = this.carrier.sprite.x - this.carrier.sprite.halfWidth
            this.sprite.y = this.carrier.sprite.y
            break
        default:
            break
    }
}

Sword.prototype.drop = function(hit) {

    if (typeof hit === 'object') {
        hit = hit.keys().next().value
    }
    // Allows the sword to bounce off obstacles and walls
    game.soundManager.play.swordHit(this.bounces)
    if (this.bounces) {
        switch(hit) {
        case 'top':
            this.vy *= -1
            if(this.initialDirection ==="vertical"){
                this.setSprite('down')
            }
            break
        case 'bottom':
            this.vy *= -1
            if(this.initialDirection ==="vertical"){
            this.setSprite('up')
            }
            break
        case 'left':
            this.vx *= -1
            if(this.initialDirection ==="horizontal"){            
                this.setSprite('right')
            }
            break
        case 'right':
            this.vx *= -1
            if(this.initialDirection ==="horizontal"){
                this.setSprite('left')
            }
            break
        default:
            break
        }
        this.bounces -= 1
    } else {
        switch(hit) {
        case 'top':
            if(this.initialDirection === "vertical"){
                this.setSprite('up')
            }
            break
        case 'bottom':
            if(this.initialDirection === "vertical"){
                this.setSprite('down')
            }
            break
        case 'left':
            if(this.initialDirection === "horizontal"){
                this.setSprite('left')
            }
            break
        case 'right':
            if(this.initialDirection === "horizontal"){
                this.setSprite('right')
            }
            break
        default:
            break
        }
        //If all bounces have happened, allow the sword to be picked up by any player
        if (this.carrier) {
            this.carrier.sword = null
            this.carrier = null
            this.initialDirection = null
        }
        this.bounces = this.totalBounces
        this.vx = 0
        this.vy = 0
        //If the sword has been thrown too many times remove from play for 5 seconds
        if (!this.throws) {
            this.sprite.x = -10000
            this.sprite.y = -10000
            const respawnTimer = setTimeout(function() {
                this.sprite.x = this.spawnPoint.x
                this.sprite.y = this.spawnPoint.y
                this.setSprite('up')
                this.throws = this.totalThrows
                clearTimeout(respawnTimer)
            }.bind(this), this.respawnTime)
        }
    }
}

Sword.prototype.update = function() {
    this.sprite.x += this.vx * game.deltaTime
    this.sprite.y += this.vy * game.deltaTime
}

Sword.prototype.setup = function(pos, textureName, stage) {
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
    this.spawnPoint = pos
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
    const pos = {
        x: this.sprite.x,
        y: this.sprite.y
    }

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

    this.sprite.x = pos.x
    this.sprite.y = pos.y

    stage.addChild(this.sprite)
}
