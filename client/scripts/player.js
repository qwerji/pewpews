function Player() {
    
    this.texture = null
    this.sprite = null
    this.gamePad = null
    this.socket = {
            id:1
    }
    //Movement
    this.vx = 0
    this.vy = 0
    this.speed = 5
    this.easing = 0.85
    //Shooting
    this.rateOfFire = 800
    this.canFire = true

    this.setupKeyboard = () => {
        const W = keyboard(87),
            A = keyboard(65),
            S = keyboard(83),
            D = keyboard(68),
            Up = keyboard(38),
            Left = keyboard(37),
            Right = keyboard(39),
            Down = keyboard(40),
            _this = this
        let shootTimer = null;
        
        function fire(direction, texture){
            const projectile = new Projectile()
            projectile.setup(direction, _this.sprite, texture, stage)
            game.projectiles.push(projectile)
        }
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
        Up.press = () => {
            // Checks if player can fire
            if(this.canFire){
                // Creates a projectile from the desired direction and texture
                fire("up","spear")
                // Sets a delay on the rate projectiles are fired
                this.coolDown()
            }
            // Clears any existing timer
            clearInterval(shootTimer)
            // Repeated fire interval
            shootTimer = setInterval(function(){
                fire("up","spear")       
            },this.rateOfFire)
        }
        // Stops shooting on button release
        Up.release = () => {
            clearInterval(shootTimer)
        }
        Left.press = () => {
            if(this.canFire){
                fire("left","spear")
                this.coolDown()
            }
            clearInterval(shootTimer)
            shootTimer = setInterval(function(){
                fire("left","spear")       
            },this.rateOfFire)
        }
        Left.release = () => {
            clearInterval(shootTimer)
        }
        Right.press = () => {
            if(this.canFire){
                fire("right","spear")
                this.coolDown()
            }
            clearInterval(shootTimer)
            shootTimer = setInterval(function(){
                fire("right","spear")       
            },this.rateOfFire)
        }
        Right.release = () => {
            clearInterval(shootTimer)
        }
        Down.press = () => {
            if(this.canFire){
                fire("down","spear")
                this.coolDown()
            }
            clearInterval(shootTimer)
            shootTimer = setInterval(function(){
                fire("down","spear")       
            },this.rateOfFire)
        }
        Down.release = () => {
            clearInterval(shootTimer)
        }


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
