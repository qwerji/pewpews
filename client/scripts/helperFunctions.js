function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

function generateLevelFromImage(src, cb) {
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
