function Sword(){
    this.sprite = null
    this.vx = 0
    this.vy = 0
    this.speed = 325
    this.source = null
    this.damage = 0
    this.carrier = null

}
Sword.prototype.equippedBy = function(player) {
    this.carrier = player
}
Sword.prototype.throw = function(direction){
    if(this.carrier) this.carrier.sword = null
        switch (direction) {
        case "up":
            this.vy = -this.speed
            break;
        case "right":
            this.sprite.rotation = toRadians(90)
            this.vx = this.speed
            break;
        case "down":
            this.sprite.rotation = toRadians(180)
            this.vy = this.speed
            break;
        case "left":
            this.sprite.rotation = toRadians(270)
            this.vx = -this.speed
            break;
        default:
            break;
    }
}
Sword.prototype.drop = function(){
    this.vx = 0
    this.vy = 0
    this.carrier = null
}
Sword.prototype.update = function() {
    this.sprite.x += this.vx * game.deltaTime
    this.sprite.y += this.vy * game.deltaTime
}

Sword.prototype.setup = function(pos,textureName, stage) {

    this.damage = 100
    this.sprite = new PIXI.Sprite(
        PIXI.loader.resources[textureName].texture
    )
    this.sprite.height = 80
    this.sprite.width = 26
    this.sprite.x = pos.x
    this.sprite.y = pos.y
    this.sprite.anchor.set(.5, .5)
    this.sprite.zIndex = 10
    stage.addChild(this.sprite)
}
