function Player() {
    
    this.texture = null
    this.sprite = null
    this.vx = 0
    this.vy = 0
    this.speed = 5
    this.easing = 0.85

    this.setupKeyboard = () => {
        const W = keyboard(87),
            A = keyboard(65),
            S = keyboard(83),
            D = keyboard(68)

        W.press = () => {
            this.vy = -this.speed
            this.ySlowing = false
        }
        W.release = () => {
            if (!S.isDown) {
                this.ySlowing = true
            } else {
                this.vy = this.speed
            }
        }

        A.press = () => {
            this.vx = -this.speed
            this.xSlowing = false
        }
        A.release = () => {
            if (!D.isDown) {
                this.xSlowing = true
            } else {
                this.vx = this.speed
            }
        }

        S.press = () => {
            this.vy = this.speed
            this.ySlowing = false
        }
        S.release = () => {
            if (!W.isDown) {
                this.ySlowing = true
            } else {
                this.vy = -this.speed
            }
        }

        D.press = () => {
            this.vx = this.speed
            this.xSlowing = false
        }
        D.release = () => {
            if (!A.isDown) {
                this.xSlowing = true
            } else {
                this.vx = -this.speed
            }
        }
    }

    this.setup = (texture, stage) => {
        this.texture = PIXI.loader.resources[texture].texture
        this.sprite = new PIXI.Sprite(this.texture)

        this.sprite.height = 100
        this.sprite.width = 100
        this.sprite.x = window.innerWidth/2 - this.sprite.width/2
        this.sprite.y = window.innerHeight/2 - this.sprite.height/2

        this.setupKeyboard()

        stage.addChild(this.sprite)
    }

    this.update = () => {

        this.sprite.x += this.vx
        this.sprite.y += this.vy

        if (this.xSlowing) {
            this.vx *= this.easing
        }
        if (this.ySlowing) {
            this.vy *= this.easing
        }

    }

}
