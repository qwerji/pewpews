function GameOver() {

    this.title = null
    this.player = null
    this.shouldLoop = true

    this.loop = () => {
        this.player.updatePadInput(this)
        renderer.render(stage)
        if (this.shouldLoop) {
            requestAnimationFrame(this.loop)
        } else {
            requestAnimationFrame(game.gameLoop)
        }
    }

    this.setup = gameResults => {
        this.player = gameResults.player

        this.background = new PIXI.Graphics()
        this.background.beginFill(0x535353)
        this.background.drawRect(0, 0, renderer.width, renderer.height)
        this.background.endFill()
        this.background.zIndex = 20

        this.title = new PIXI.Text('Player ' + (gameResults.winner.gamePadIndex+1) + ' wins!', game.constants.healthBarTextStyle)
        this.title.x = renderer.width/2
        this.title.y = renderer.height/2
        this.title.zIndex = 21

        stage.addChild(this.background)
        stage.addChild(this.title)
        requestAnimationFrame(this.loop)
    }

    this.backToMenu = () => {
        game.restart()
        game.stopLoop = true
        menu.slots.forEach(slot => {
            slot.isReady = false
            if (slot.player) {
                slot.player.gameState = 'menu'
            }
        })
        for (let i = stage.children.length-1; i >= 0; i--) {
            stage.removeChild(stage.children[i])
        }
        stage.removeChild(this.background)
        stage.removeChild(this.title)
        this.shouldLoop = false
        menu.reset()
    }

    this.restart = () => {
        game.restart()
        stage.removeChild(this.background)
        stage.removeChild(this.title)
        this.shouldLoop = false
    }

}