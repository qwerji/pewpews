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

    // Xbox Controller

    // Movement
    const axes = gpState.axes

    this.vy = this.speed * axes[1]
    this.vx = this.speed * axes[0]

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
    const axes = {
        x: 0,
        y: 0
    }
    // Movement

    // UP
    if (keys.W.isDown) {
        axes.y += -1
    }

    // RIGHT
    if (keys.D.isDown) {
        axes.x += 1
    }

    // DOWN
    if (keys.S.isDown) {
        axes.y += 1
    }

    // LEFT
    if (keys.A.isDown) {
        axes.x += -1
    }
    
    this.vx = this.speed * axes.x
    this.vy = this.speed * axes.y

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
