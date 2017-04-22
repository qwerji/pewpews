function Player(gamePadIndex) {
    
    this.sprite = null
    this.healthBar = null
    
    this.gamePadIndex = gamePadIndex
    this.keys = {}

    // THE DREAM LIVES ON
    // #ONEDAY
    this.socket = {
        id:1
    }

    //Movement
    this.vx = 0
    this.vy = 0
    this.speed = 250
    this.easing = 0.75

    //Shooting
    this.rateOfFire = 300
    this.canFire = true
    this.shootTimer = null

    this.health = 100
    this.isAlive = true
    this.respawnTime = 5000

}

Player.prototype.takeDamage = function(source) {
    this.health -= source.damage
    if (this.health <= 0) {
        this.die()
    }
}

Player.prototype.die = function() {

    this.isAlive = false
    this.sprite.x = 100000
    this.sprite.y = 100000
    this.healthBar.x = this.sprite.x - this.healthBar.width / 2
    this.healthBar.y = this.sprite.y - this.sprite.halfHeight - 40
    const respawnTimer = setTimeout(function() {
        this.sprite.x = randomInt(0, renderer.width)
        this.sprite.y = randomInt(0, renderer.height)
        this.isAlive = true
        this.health = 100
        clearTimeout(respawnTimer)
    }.bind(this), this.respawnTime)

}

Player.prototype.fire = function(direction) {

    // Checks if player can fire
    if (this.canFire) {
        // Creates a projectile from the desired direction and texture
        const projectile = new Projectile()
        projectile.setup(direction, 1, stage, this)
        game.projectiles.push(projectile)
            // Sets a delay on the rate projectiles are fired
        this.coolDown()
    }
    // Clears any existing timer
    clearInterval(this.shootTimer)
        // Repeated fire interval
    this.shootTimer = setInterval(function() {
        this.fire(direction)
    }.bind(this), this.rateOfFire)

}

Player.prototype.ceaseFire = function() {
    clearInterval(this.shootTimer)
}

Player.prototype.setupKeyboard = function() {

    const keys = this.keys

    keys.W = keyboard(87)
    keys.A = keyboard(65)
    keys.S = keyboard(83)
    keys.D = keyboard(68)
    keys.Up = keyboard(38)
    keys.Left = keyboard(37)
    keys.Right = keyboard(39)
    keys.Down = keyboard(40)

}

Player.prototype.coolDown = function() {
    this.canFire = false
    setTimeout(function() {
        this.canFire = true
    }.bind(this), this.rateOfFire)
}

Player.prototype.setup = function(textureName, stage) {

    this.sprite = new PIXI.Sprite(
        PIXI.loader.resources[textureName].texture
    )

    this.sprite.height = 50
    this.sprite.width = 50
    this.sprite.anchor.set(.5, .5)
    this.sprite.x = renderer.width / 2
    this.sprite.y = renderer.height / 2
    this.sprite.zIndex = 0

    if (this.gamePadIndex === undefined) {
        this.setupKeyboard()
    }

    this.healthBar = new PIXI.Text(`${this.health}`, game.constants.healthBarTextStyle);
    this.healthBar.zIndex = 10

    this.sprite.addChild(this.healthBar)
    stage.addChild(this.sprite, this.healthBar)
}

Player.prototype.getGamePadInfo = function() {
    return game.gamePads.getGamepadInfo(this.gamePadIndex)
}

Player.prototype.updatePadInput = function() {
    const gpState = this.getGamePadInfo()

    // Xbox Controller

    // Movement
    const axes = gpState.axes,
        sensitivity = 0.3
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
        this.fire("up")
    } else {
        this.ceaseFire()
    }

    // RIGHT
    if (buttons[1].pressed) {
        this.fire("right")
    } else {
        this.ceaseFire()
    }

    // DOWN
    if (buttons[0].pressed) {
        this.fire("down")
    } else {
        this.ceaseFire()
    }

    // LEFT
    if (buttons[2].pressed) {
        this.fire("left")
    } else {
        this.ceaseFire()
    }
}

Player.prototype.updateKeyInput = function() {

    const keys = this.keys

    // Movement

    // UP
    if (keys.W.isDown) {
        this.vy = -this.speed
    } else {
        this.ySlowing = true
    }

    // RIGHT
    if (keys.D.isDown) {
        this.vx = this.speed
    } else {
        this.xSlowing = true
    }

    // DOWN
    if (keys.S.isDown) {
        this.vy = this.speed
    } else {
        this.ySlowing = true
    }

    // LEFT
    if (keys.A.isDown) {
        this.vx = -this.speed
    } else {
        this.xSlowing = true
    }

    // Firing

    // UP
    if (keys.Up.isDown) {
        this.fire("up")
    } else {
        this.ceaseFire()
    }

    // RIGHT
    if (keys.Right.isDown) {
        this.fire("right")
    } else {
        this.ceaseFire()
    }

    // DOWN
    if (keys.Down.isDown) {
        this.fire("down")
    } else {
        this.ceaseFire()
    }

    // LEFT
    if (keys.Left.isDown) {
        this.fire("left")
    } else {
        this.ceaseFire()
    }
}

Player.prototype.update = function() {

    // Update health bar

    if (this.gamePadIndex !== undefined) {
        this.updatePadInput()
    } else {
        this.updateKeyInput()
    }

    this.sprite.x += this.vx * game.deltaTime
    this.sprite.y += this.vy * game.deltaTime

    if (this.xSlowing) {
        this.vx *= this.easing
    }
    if (this.ySlowing) {
        this.vy *= this.easing
    }

    this.healthBar.text = this.health
    this.healthBar.x = this.sprite.x - this.healthBar.width / 2

    if (this.sprite.y < 90) {
        this.healthBar.y = this.sprite.y + this.sprite.halfHeight
    } else {
        this.healthBar.y = this.sprite.y - this.sprite.halfHeight - 40
    }

}
