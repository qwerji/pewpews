function Player(gamePadIndex) {
    
    this.texture = null
    this.sprite = null
    this.gamePadIndex = gamePadIndex
    this.socket = {
        id:1
    }

    this.health = 100
    this.healthBar = null

    //Movement
    this.vx = 0
    this.vy = 0
    this.speed = 250
    this.easing = 0.85

    //Shooting
    this.rateOfFire = 100
    this.canFire = true

    this.isAlive = true
    this.respawnTime = 5000

    let shootTimer = null
    
    this.takeDamage = source => {
        this.health -= source.damage
        
        if (this.health <= 0) {
            this.die()
        }

    }

    this.die = () => {

        this.isAlive = false
        this.sprite.x = 100000
        this.sprite.y = 100000
        this.healthBar.x = this.sprite.x - this.healthBar.width/2
        this.healthBar.y = this.sprite.y - this.sprite.halfHeight - 40
        const respawnTimer = setTimeout(function() {
            this.sprite.x = randomInt(0, renderer.width)
            this.sprite.y = randomInt(0, renderer.height)
            this.isAlive = true
            this.health = 100
            clearTimeout(respawnTimer)
        }.bind(this), this.respawnTime)

    }

    this.fire = (direction, texture) => {
        const projectile = new Projectile()
        projectile.setup(direction, texture, stage, this)
        game.projectiles.push(projectile)
    }

    this.fireUp = () => {
        // Checks if player can fire
        if (this.canFire) {
            // Creates a projectile from the desired direction and texture
            this.fire("up", randomInt(0,5))
                // Sets a delay on the rate projectiles are fired
            this.coolDown()
        }
        // Clears any existing timer
        clearInterval(shootTimer)
            // Repeated fire interval
        shootTimer = setInterval(function() {
            this.fire("up", randomInt(0,5))
        }, this.rateOfFire)
    }

    this.fireRight = () => {
        if(this.canFire){
            this.fire("right", randomInt(0,5))
            this.coolDown()
        }
        clearInterval(shootTimer)
        shootTimer = setInterval(function(){
            this.fire("right", randomInt(0,5))       
        },this.rateOfFire)
    }

    this.fireDown = () => {
        if (this.canFire) {
            this.fire("down", randomInt(0,5))
            this.coolDown()
        }
        clearInterval(shootTimer)
        shootTimer = setInterval(function() {
            this.fire("down", randomInt(0,5))
        },this.rateOfFire)
    }

    this.fireLeft = () => {
        if(this.canFire){
            this.fire("left", randomInt(0,5))
            this.coolDown()
        }
        clearInterval(shootTimer)
        shootTimer = setInterval(function(){
            this.fire("left", randomInt(0,5))
        },this.rateOfFire)
    }

    this.ceaseFire = () => {
        clearInterval(shootTimer)
    }

    this.setupKeyboard = () => {
        const W = keyboard(87),
            A = keyboard(65),
            S = keyboard(83),
            D = keyboard(68),
            Up = keyboard(38),
            Left = keyboard(37),
            Right = keyboard(39),
            Down = keyboard(40)
        
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
        // Shooting Controls

        // Shoots Up
        Up.press = this.fireUp
        // Stops shooting on button release
        Up.release = this.ceaseFire
        Left.press = this.fireLeft
        Left.release = this.ceaseFire
        Right.press = this.fireRight
        Right.release = this.ceaseFire
        Down.press = this.fireDown
        Down.release = this.ceaseFire
    }

    this.coolDown = () => {
        this.canFire = false
        const _this = this
        setTimeout(function(){
            _this.canFire = true
        },this.rateOfFire)
    }

    this.setup = (texture, stage) => {
        this.texture = PIXI.loader.resources[texture].texture
        this.sprite = new PIXI.Sprite(this.texture)

        this.sprite.height = 100
        this.sprite.width = 100
        this.sprite.anchor.set(.5, .5)
        this.sprite.x = renderer.width/2 - this.sprite.width/2
        this.sprite.y = renderer.height/2 - this.sprite.height/2
        
        if (this.gamePadIndex === undefined) {
            this.setupKeyboard()
        }

        this.healthBar = new PIXI.Text(`${this.health}`, game.constants.healthBarTextStyle);
        this.healthBar.zIndex = 10

        this.sprite.addChild(this.healthBar)
        stage.addChild(this.sprite)
        stage.addChild(this.healthBar)
    }

    this.updatePadInput = () => {
        const gpState = this.getGamePadInfo()

        // Xbox Controller

        // Movement
        const axes = gpState.axes, sensitivity = 0.3
        // UP
        if (axes[1] <= -sensitivity) {
            this.vy = -this.speed
        } else {
            this.ySlowing = true
        }

        // RIGHT
        if (axes[0] >= sensitivity) {
            this.vx = this.speed
        } else {
            this.xSlowing = true
        }

        // DOWN
        if (axes[1] >= sensitivity) {
            this.vy = this.speed
        } else {
            this.ySlowing = true
        }

        // LEFT
        if (axes[0] <= -sensitivity) {
            this.vx = -this.speed
        } else {
            this.xSlowing = true
        }

        // Firing

        const buttons = gpState.buttons

        // UP
        if (buttons[3].pressed) {
            this.fireUp()
        } else {
            this.ceaseFire()
        }

        // RIGHT
        if (buttons[1].pressed) {
            this.fireRight()
        } else {
            this.ceaseFire()
        }

        // DOWN
        if (buttons[0].pressed) {
            this.fireDown()
        } else {
            this.ceaseFire()
        }

        // LEFT
        if (buttons[2].pressed) {
            this.fireLeft()
        } else {
            this.ceaseFire()
        }
    }

    this.getGamePadInfo = () => {
        return game.gamePads.getGamepadInfo(this.gamePadIndex)
    }

    this.update = () => {
        // Update health bar position
        this.healthBar.text = `${this.health}`
        // console.log(this.healthBar)
        this.healthBar.x = this.sprite.x - this.healthBar.width/2
        this.healthBar.y = this.sprite.y - this.sprite.halfHeight - 40

        if (this.gamePadIndex !== undefined) {
            this.updatePadInput()
        }

        this.sprite.x += this.vx * game.deltaTime
        this.sprite.y += this.vy * game.deltaTime

        if (this.xSlowing) {
            this.vx *= this.easing
        }
        if (this.ySlowing) {
            this.vy *= this.easing
        }

    }

}
