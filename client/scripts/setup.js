//Create the renderer
var renderer = PIXI.autoDetectRenderer(
    800, 600,
    {antialias: true}
);

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//Create a container object called the `stage`
var stage = new PIXI.Container();
//Tell the `renderer` to `render` the `stage`


// Initialize Collision Library
const BUMP = new Bump()

const game = new Game()
const fpsDisplay = document.getElementById('fpsDisplay')

PIXI.loader
    .add('fat', 'images/sprites/players/fat.png')
    .add('obstacle', 'images/sprites/terrain/obstacle.png')
    .add('0', 'images/sprites/projectiles/projectile_0.png')
    .add('1', 'images/sprites/projectiles/projectile_1.png')
    .add('2', 'images/sprites/projectiles/projectile_2.png')
    .add('3', 'images/sprites/projectiles/projectile_3.png')
    .add('4', 'images/sprites/projectiles/projectile_4.png')
    .add('5', 'images/sprites/projectiles/projectile_5.png')
    .load(game.setup)
