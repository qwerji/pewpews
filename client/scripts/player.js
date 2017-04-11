function Player() {
    
    this.texture = null
    this.sprite = null
    this.vx = 0
    this.vy = 0
    this.speed = 5

    this.setupKeyboard = () => {
        const W = keyboard(87),
            A = keyboard(65),
            S = keyboard(83),
            D = keyboard(68)

        W.press = () => {
            this.vy = -this.speed
        }
        W.release = () => {
            if (!S.isDown) {
                this.vy = 0
            }
        }

        A.press = () => {
            this.vx = -this.speed
        }
        A.release = () => {
            if (!D.isDown) {
                this.vx = 0
            }
        }

        S.press = () => {
            this.vy = this.speed
        }
        S.release = () => {
            if (!W.isDown) {
                this.vy = 0
            }
        }

        D.press = () => {
            this.vx = this.speed
        }
        D.release = () => {
            if (!A.isDown) {
                this.vx = 0
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

    }

}
