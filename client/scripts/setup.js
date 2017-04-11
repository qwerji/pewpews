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
renderer.resize(window.innerWidth, window.innerHeight);
// renderer.view.style.width = window.innerWidth
// renderer.view.style.height = window.innerHeight

// Initialize Collision Library
const BUMP = new Bump()

const game = new Game()

PIXI.loader.add('demon', 'images/sprites/fat.png').load(game.setup)


