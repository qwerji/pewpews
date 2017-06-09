PIXI.utils.skipHello()
console.log('Powered by Pixi.js + Bump')
console.log('Devs: punkty, qwerji')
console.log('%c 🐌', 'font-size: 40px;')

//Create the renderer
const renderer = PIXI.autoDetectRenderer(
    1600, 1200,
    {
        antialias: true, 
        transparent: false, 
        backgroundColor: 0x000000
    }
);

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//Create a container object called the `stage`
const statusBarOffset = 200
const stage = new PIXI.Container();

// Initialize Collision Library
const BUMP = new Bump()

const gamePad = new Gamepad()
const menu = new Menu()
const game = new Game()
const fpsDisplay = document.createElement('P')
fpsDisplay.id = 'fpsDisplay'
document.body.appendChild(fpsDisplay)

PIXI.loader
    .add('fat', 'images/sprites/players/cowbro.png')
    .add('temp-avatar', 'images/sprites/players/temp-avatar.png')
    .add('ready', 'images/sprites/menu/ready.png')
    .add('obstacle', 'images/sprites/terrain/obstacle.png')
    .add('wall', 'images/sprites/terrain/wall.png')
    .add('0', 'images/sprites/projectiles/projectile_0.png')
    .add('1', 'images/sprites/projectiles/projectile_1.png')
    .add('2', 'images/sprites/projectiles/projectile_2.png')
    .add('3', 'images/sprites/projectiles/projectile_3.png')
    .add('4', 'images/sprites/projectiles/projectile_4.png')
    .add('5', 'images/sprites/projectiles/projectile_5.png')
    .add('6', 'images/sprites/projectiles/projectile_6.png')
    .add('6h', 'images/sprites/projectiles/projectile_6h.png')
    .add('7', 'images/sprites/projectiles/projectile_7.png')
    .load(menu.setup)
