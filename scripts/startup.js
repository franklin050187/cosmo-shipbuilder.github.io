//Happens after the window loaded to prevent drawing on a non existent canvas
window.onload = () => {
	loadJson(JSON.stringify(startup_ship_data))
};
// Load a default category
resetPlacementCategories()
preloadSprites()
// Initialize the canvas
loadPreviewSpriteImage()
initializeCanvas()
redrawEntireCanvas()
closeHelp()

for (let role in crew_roles) {
	global_crew_roles.push(crew_roles[role])
}


function initializeCanvas() {
	const container = document.querySelector('.canvas-container');
	const containerWidth = container.clientWidth;
	const containerHeight = container.clientHeight;
  
	// Calculate the world "size" based on fixed gridSize so the canvas fits the container.
	const sizeFromWidth = (containerWidth / gridSize - 1) / 2;
	const sizeFromHeight = (containerHeight / gridSize - 1) / 2;
	let size = [sizeFromWidth, sizeFromHeight];
  
	let minX = -size[0], minY = -size[1], maxX = size[0], maxY = size[1]
	const width = (maxX - minX + 1) * gridSize;
	const height = (maxY - minY + 1) * gridSize;
	document.querySelectorAll("canvas").forEach(canvas => {
	  canvas.width = width;
	  canvas.height = height;
	});
	redrawEntireCanvas();
}

/*
function initializeCanvas() {
	// Adjust canvas size
	let size = 16
	minX = -size;
	minY = -size;
	maxX = size;
	maxY = size; 
	const width = (maxX - minX + 1) * gridSize;
	const height = (maxY - minY + 1) * gridSize;
	document.querySelectorAll("canvas").forEach(canvas => {
        canvas.width = width;
        canvas.height = height;
    })
	updateCanvas()
}
*/

window.addEventListener('resize', initializeCanvas)

function loadPreviewSpriteImage() {
	const selectedSprite = global_sprites_to_place[0].ID;
	const imageName = selectedSprite.replace("cosmoteer.", "");
	previewSpriteImage.src = `sprites/parts/${imageName}.png`;

	previewSpriteImage.onload = () => {
		isPreviewSpriteLoaded = true;
	};
}
