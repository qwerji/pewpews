function LevelManager() {

    this.generateRGBAFromImage = function(src, cb) {
        // Ben wrote this
        const image = new Image()
        image.src = src
        const canvas = document.createElement('CANVAS')
        const ctx = canvas.getContext('2d')
        image.onload = () => {
            canvas.width = image.naturalWidth
            canvas.height = image.naturalHeight
            ctx.drawImage(image, 0, 0)
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
            const pixels = []
            for (let i = 0; i < data.length; i += 4) {
                pixels.push({
                    r: data[i],
                    g: data[i + 1],
                    b: data[i + 2],
                    a: data[i + 3]
                })
            }
            const level = []
            for (let i = 0; i < image.naturalHeight; i++) {
                level[i] = []
                const row = level[i]
                for (let j = 0; j < image.naturalWidth; j++) {
                    row.push(pixels[(image.naturalWidth * i) + j])
                }
            }
            cb(level)
        }
    }

    this.generateEntities = level => {
        const obstacles = [],
            spawnPoints = []
        for (let i = 0; i < level.length; i++) {
            const row = level[i]
            for (let j = 0; j < row.length; j++) {
                if (row[j].r === 0 &&
                    row[j].g === 0 &&
                    row[j].b === 0 &&
                    row[j].a === 255)
                {
                    const obstacle = new Obstacle()
                    obstacle.setup(
                        'obstacle', { x: (j + 1) * 50, y: (i + 1) * 50 },
                        stage
                    )
                    obstacles.push(obstacle)
                } else if (
                    row[j].r === 0 &&
                    row[j].g === 255 &&
                    row[j].b === 0 &&
                    row[j].a === 255)
                {
                    spawnPoints.push({ x: (j + 1) * 50, y: (i + 1) * 50 })
                }
            }
        }
        return {obstacles,spawnPoints}
    }

    this.getLevel = function(levelID, cb) {

        const levelInfo = this.levelData[levelID]

        const sword = new Sword()
        sword.setup(levelInfo.sword.pos, levelInfo.sword.texture, stage)
        let objects

        (new Wall()).setup('wall', 'top', stage);
        (new Wall()).setup('wall', 'right', stage);
        (new Wall()).setup('wall', 'bottom', stage);
        (new Wall()).setup('wall', 'left', stage)

        this.generateRGBAFromImage(this.levelData[levelID].imageSrc, function(level) {
            const objects = this.generateEntities(level)
            cb({
                sword: sword,
                obstacles: objects.obstacles,
                spawnPoints: objects.spawnPoints
            })
        }.bind(this))
    }

    this.levelData = {
        1: {
            imageSrc: '../images/levels/cornelius.png',
            sword: { 
                pos: {
                    x: renderer.width/2, y: renderer.height/2
                },
                texture: '6' 
            }
        },
        2: {
            imageSrc: '../images/levels/ripdocem.png',
            sword: { 
                pos: {
                    x: renderer.width/2, y: renderer.height/2
                },
                texture: '6'
            }
        }
    }

}
