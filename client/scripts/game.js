function Game() {

    this.opponents = null
    this.player = null

    this.gameLoop = () => {
        requestAnimationFrame(this.gameLoop)

        this.player.update()

        // Loop opponents and update

        renderer.render(stage)
    }

    this.setup = () => {
        console.log('Setup')

        const player = new Player()
        player.setup('demon', stage)
        this.player = player

        this.opponents = []

        renderer.render(stage)
        this.gameLoop()
    }

}
