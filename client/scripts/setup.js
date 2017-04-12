//Create the renderer
var renderer = PIXI.autoDetectRenderer(
    256, 256,
    {antialias: true, resolution: 2}
);

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//Create a container object called the `stage`
var stage = new PIXI.Container();

//Tell the `renderer` to `render` the `stage`
// renderer.render(stage);
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.backgroundColor = 0x002e62
renderer.resize(window.innerWidth, window.innerHeight);
// renderer.view.style.width = window.innerWidth
// renderer.view.style.height = window.innerHeight

// Initialize Collision Library
const BUMP = new Bump()

const game = new Game()
const gamePad = new Gamepad()
gamePad.setup()
PIXI.loader
    .add('demon', 'images/sprites/fat.png')
    .add('obstacle', 'images/sprites/obstacle.png')
    .add('spear', 'images/sprites/spear.png')
    .load(game.setup)
