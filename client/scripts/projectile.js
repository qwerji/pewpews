function Projectile() {
    this.texture = null
    this.sprite = null
    this.vx = 0
    this.vy = 0
    this.speed = 7
    this.easing = 1

    this.setup = (direction, originSprite, texture, stage) => {
        this.texture = PIXI.loader.resources[texture].texture
        this.sprite = new PIXI.Sprite(this.texture)
        this.sprite.height = 50
        this.sprite.width = 50
        this.sprite.x = originSprite.x
        this.sprite.y = originSprite.y
        this.sprite.anchor.set(.5, .5)
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
        stage.addChild(this.sprite)
    }
    this.update = () => {

        this.sprite.x += this.vx
        this.sprite.y += this.vy

        //Easing
        // if (this.xSlowing) {
        //     this.vx *= this.easing
        // }
        // if (this.ySlowing) {
        //     this.vy *= this.easing
        // }

    }
    
}