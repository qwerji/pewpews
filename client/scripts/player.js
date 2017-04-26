function Player(gamePadIndex) {
    
    this.sprite = null
    this.healthBar = null
    this.sword = null    
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

    this.controllerLayout = {
        axes: {
            x: 0,
            y: 1
        },
        buttons: {
            up: 3,
            right: 1,
            down: 0,
            left: 2
        }
    }

}

Player.prototype.takeDamage = function(source) {
    this.health -= source.damage
    if (this.health <= 0) {
        this.die()
    }
}

Player.prototype.die = function() {

    if (this.sword) {
        this.sword.drop()
    }

    this.isAlive = false
    this.sprite.x = 100000
    this.sprite.y = 100000
    this.healthBar.x = this.sprite.x - this.healthBar.width / 2
    this.healthBar.y = this.sprite.y - this.sprite.halfHeight - 40
    const respawnTimer = setTimeout(function() {
        const spawnPoint = game.getSpawnPoint()
        this.sprite.x = spawnPoint.x
        this.sprite.y = spawnPoint.y
        this.isAlive = true
        this.health = 100
        clearTimeout(respawnTimer)
    }.bind(this), this.respawnTime)

}

Player.prototype.fire = function(direction) {
    if(this.sword){
        if (this.canFire) {
            this.sword.throw(direction)
            this.coolDown()
        }
    } else {
        // Checks if player can fire
        if (this.canFire) {
            // Creates a projectile from the desired direction and texture
            const projectile = new Projectile()
            projectile.setup(direction, 1, stage, this)
            game.projectiles.push(projectile)
            // Sets a delay on the rate projectiles are fired
            this.coolDown()
        }
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
    keys.walkUp = keyboard(87)
    keys.walkRight = keyboard(68)
    keys.walkDown = keyboard(83)
    keys.walkLeft = keyboard(65)
    keys.fireUp = keyboard(38)
    keys.fireRight = keyboard(39)
    keys.fireDown = keyboard(40)
    keys.fireLeft = keyboard(37)
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

    this.sprite.height = 100
    this.sprite.width = 100
    this.sprite.anchor.set(.5, .5)
    const spawnPoint = game.getSpawnPoint()
    this.sprite.x = spawnPoint.x
    this.sprite.y = spawnPoint.y
    this.sprite.zIndex = 0

    if (this.gamePadIndex === undefined) {
        this.setupKeyboard()
    }

    this.healthBar = new PIXI.Text(this.health, game.constants.healthBarTextStyle);
    this.healthBar.zIndex = 10

    this.sprite.addChild(this.healthBar)
    stage.addChild(this.sprite, this.healthBar)
}

Player.prototype.getGamePadInfo = function() {
    return game.gamePads.getGamepadInfo(this.gamePadIndex)
}

Player.prototype.updatePadInput = function() {
    const gpState = this.getGamePadInfo()
    if (!gpState) return
    // Xbox Controller

    // Movement
    const axes = gpState.axes,
        axesLayout = this.controllerLayout.axes

    this.vy = this.speed * axes[axesLayout.y]
    this.vx = this.speed * axes[axesLayout.x]

    // Firing

    const buttons = gpState.buttons,
        buttonsLayout = this.controllerLayout.buttons

    // UP
    if (buttons[buttonsLayout.up].pressed) {
        this.fire("up")
    } else {
        this.ceaseFire()
    }

    // RIGHT
    if (buttons[buttonsLayout.right].pressed) {
        this.fire("right")
    } else {
        this.ceaseFire()
    }

    // DOWN
    if (buttons[buttonsLayout.down].pressed) {
        this.fire("down")
    } else {
        this.ceaseFire()
    }

    // LEFT
    if (buttons[buttonsLayout.left].pressed) {
        this.fire("left")
    } else {
        this.ceaseFire()
    }
}

Player.prototype.updateKeyInput = function() {

    const keys = this.keys,
        axes = {
            x: 0,
            y: 0
        }

    // Movement

    // UP
    if (keys.walkUp.isDown) {
        axes.y += -1
    }

    // RIGHT
    if (keys.walkRight.isDown) {
        axes.x += 1
    }

    // DOWN
    if (keys.walkDown.isDown) {
        axes.y += 1
    }

    // LEFT
    if (keys.walkLeft.isDown) {
        axes.x += -1
    }
    
    this.vx = this.speed * axes.x
    this.vy = this.speed * axes.y

    // Firing
    
    // UP
    if (keys.fireUp.isDown) {
        this.fire("up")
    } else {
        this.ceaseFire()
    }

    // RIGHT
    if (keys.fireRight.isDown) {
        this.fire("right")
    } else {
        this.ceaseFire()
    }

    // DOWN
    if (keys.fireDown.isDown) {
        this.fire("down")
    } else {
        this.ceaseFire()
    }

    // LEFT
    if (keys.fireLeft.isDown) {
        this.fire("left")
    } else {
        this.ceaseFire()
    }
}
Player.prototype.getSword = function(sword) {
    this.sword = sword
    this.sword.setSprite('up')
}
Player.prototype.update = function() {
    if(this.sword){
        this.sword.sprite.x = this.sprite.x + this.sword.xOff
        this.sword.sprite.y = this.sprite.y + this.sword.yOff
    }
    // Update health bar

    if (this.gamePadIndex !== undefined) {
        this.updatePadInput()
    } else {
        this.updateKeyInput()
    }

    this.sprite.x += this.vx * game.deltaTime
    this.sprite.y += this.vy * game.deltaTime

    this.healthBar.text = this.health
    this.healthBar.x = this.sprite.x - this.healthBar.width / 2

    if (this.sprite.y < 90) {
        this.healthBar.y = this.sprite.y + this.sprite.halfHeight
    } else {
        this.healthBar.y = this.sprite.y - this.sprite.halfHeight - 40
    }

}
