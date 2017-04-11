function Game() {

    this.opponents = null
    this.player = null

    this.gameLoop = () => {
        requestAnimationFrame(this.gameLoop)

        this.player.update()

        // Loop opponents and update
        // for (var i = 0; i < opponents.length; i++) {
        //     opponents[i].update()
        // }

        this.bumpCollisions()
        renderer.render(stage)
    }

    this.setup = () => {
        console.log('Textures Loaded')
        
        const player = new Player()
        player.setup('demon', stage)
        this.player = player

        this.opponents = []

        renderer.render(stage)
        this.gameLoop()
    }

    this.bumpCollisions = () => {
        BUMP.contain(
            this.player.sprite,
            {x:0, y:0, width: window.innerWidth, height: window.innerHeight},
            true,
            hit => {
                // console.log(hit)
            }
        )
    }

}
