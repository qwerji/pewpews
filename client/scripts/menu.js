function Menu(){
    this.slots = []
    this.background = null

    this.menuLoop = () => {
        let readyCount = 0,
           playerCount = 0;
        for(let i = 0; i < this.slots.length;i++){
            if(this.slots[i].player){
                this.slots[i].player.updatePadInput()
                playerCount ++
                if(this.slots[i].isReady){
                    readyCount ++
                }
            }
        }
        renderer.render(stage)

        // If every player is ready
        if(playerCount && (readyCount == playerCount)){
            for(let i = 0;i < this.slots.length;i++){
                stage.removeChild(this.slots[i].readySprite)
                stage.removeChild(this.slots[i].characterSprite)
            }
            stage.removeChild(this.background)
            // Start game
            let players = []
            for(let i = 0; i < this.slots.length;i++){
                if(this.slots[i].player) {
                    players.push(this.slots[i].player)
                }
            }
            game.start(players)
        } else {
            // Keep running menuLoop
            requestAnimationFrame(this.menuLoop)    
        }
    }
    this.setup = () => {
        this.background = new PIXI.Graphics();
        this.background.beginFill(0xfff6a4);
        this.background.drawRect(0, 0, renderer.width, renderer.height);
        this.background.endFill();
        this.background.zIndex = 20
        stage.addChild(this.background)

        for(let i = 0; i < 4;i++){
            this.slots.push(new Slot())
        }
        // Updates the menu
        renderer.render(stage)

        this.gamePads = new Gamepad()
        this.gamePads.setup()

        requestAnimationFrame(this.menuLoop)
    }

    this.addPlayer = gamePadIndex => {
        const player = new Player(gamePadIndex)
        // player.setup('fat', stage)
        this.slots[gamePadIndex].setPlayer(player)

    }

    this.removePlayer = i => {
        const deleted = this.slots[i]
        deleted.player = null
        // deleted.sprite.destroy(false)
        stage.removeChild(deleted.characterSprite)
        renderer.render(stage)
    }

    this.reset = function() {
        stage.addChild(this.background)
        for (let i = 0; i < this.slots.length; i++) {
            if (this.slots[i].characterSprite) {
                stage.addChild(this.slots[i].characterSprite)
            }
        }
        requestAnimationFrame(this.menuLoop)
    }
}

function Slot(){
    this.characterSprite = null
    this.readySprite = null
    this.player = null
    this.isReady = false

    this.setPlayer = player => {
        this.player = player
        // Update UI
        this.characterSprite = new PIXI.Sprite(
        PIXI.loader.resources['temp-avatar'].texture)
        this.characterSprite.x = ((renderer.width/4)*(player.gamePadIndex+1)) - (renderer.width/4)/2
        this.characterSprite.y = renderer.height/2
        this.characterSprite.anchor.set(.5, .5)
        stage.addChild(this.characterSprite)
        renderer.render(stage)

        this.readySprite = new PIXI.Sprite(
        PIXI.loader.resources['ready'].texture)
        this.readySprite.x = ((renderer.width/4)*(player.gamePadIndex+1)) - (renderer.width/4)/2
        this.readySprite.y = (renderer.height/2) + 165
        this.readySprite.anchor.set(.5, .5)
    }
    this.ready = () => {
        if(!this.isReady){
            this.isReady = true
            stage.addChild(this.readySprite)
        }
    }

    this.cancel = () => {
        if(this.isReady){
            this.isReady = false
            stage.removeChild(this.readySprite)
        }
    }
}
