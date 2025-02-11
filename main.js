const gridSize = 32; // Size of each grid cell
let isPreviewSpriteLoaded = false; // init sprite preview
const gridMap = {}; // To store the grid map
let sprite_delete_mode = []; // To store the sprite delete mode
let global_sprites_to_place = [generatePart("cosmoteer.corridor")]; // To store the sprites to place
let global_selected_sprites = []
let global_unmirrored_selected_sprites = []
let global_toggles_to_add = []
let global_mirror_axis = []
let global_mirror_center = [0,0]
let global_crew_assignments = []
let global_supply_chains = []
let global_sprites_to_draw = [] //Saves the sprites that are yet to be drawn
let global_sprites_to_delete = [] //Saves the sprites that are drawn to which should be deleted
let global_doors_to_draw = [] //Saves the doors that are yet to be drawn
let global_doors_to_delete = [] //Saves the doors that are drawn to which should be deleted
let global_recently_placed = [] //Saves recently placed parts
let global_copied_parts = []
let global_previous_mirror_mode = "vertical"
let sprites = []; // To store the sprites
let all_ship_stats = undefined

// adjust canvas size
let minX = 0;
let minY = 0;
let maxX = 0;
let maxY = 0; 

let shipdata = {}; // To store the ship data
let cursorMode = "Place"; // Initial cursor mode
let global_doors = []; // To store the doors
let global_resources = []; // To store the resources
let global_resources_to_place = []
let global_zoom_factor = 1
let global_canvases = [canvas, resource_canvas, drawing_canvas, preview_canvas, door_canvas, hitbox_canvas, grid_canvas]
let global_crew_role_to_place = undefined
let global_crew_roles = []
let global_crew_role_sources = []

const spriteCache = {};
const previewSpriteImage = new Image();

function generateShip() {
	// send post request to generate ship
	// use export json function to get shipdata
	export_json();
	// get the data
	const json_to_post = document.getElementById("json_export").value;

	const xhr = new XMLHttpRequest();
	const url =
		"https://cosmo-api-git-docker-franklin050187s-projects.vercel.app/generate";
	// const url = 'http://127.0.0.1:8001/generate';

	xhr.open("POST", url, true);
	// xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(json_to_post);

	xhr.onload = () => {
		if (xhr.status === 200) {
			const ship_link = document.getElementById("ship_link");
			const url = JSON.parse(xhr.responseText).url;
			ship_link.href = url;
			ship_link.style.display = "block";
		}
	};
}

function get_json() {//Gets the json from a picture with the url in the url text field
	const b64Input = document.getElementById("b64_input");
	const encodedB64 = b64Input.value.replace(/-/g, "+").replace(/_/g, "/");
	const jsonInput = document.getElementById("b64_input");
	const xhr = new XMLHttpRequest();
	const url = `https://cosmo-api-git-docker-franklin050187s-projects.vercel.app/edit?url=${encodedB64}`;
	xhr.open("GET", url, true);
	xhr.onload = () => {
		if (xhr.status === 200) {
			jsonInput.value = xhr.responseText;
			loadJson();
		}
	};
}

async function getJsonFromPic(file) {//Gets the json from a picture with the url in the url text field
	const jsonInput = document.getElementById("b64_input");
	const xhr = new XMLHttpRequest();
	const b64input = await fileToBase64(file);
	xhr.open("GET", b64input, true);
	xhr.onload = () => {
		if (xhr.status === 200) {
			jsonInput.value = xhr.responseText;
			loadJson();
		}
	};

	xhr.send();
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]); // Removes the data URL prefix
        reader.onerror = error => reject(error);
    });
}

function ChangeCursorMode(string) {
	const cursor_mode = document.getElementsByName("cursor_mode");
	for (const radio of cursor_mode) {
		radio.checked = false	
	}
	for (const radio of cursor_mode) {
		if (radio.id === string) {
			cursor_mode.value = string
			radio.checked = true
			handleCursorMode();
			return
		}
	}
}

function handleCursorModeChange() {
	clearPreview();
	resetPlacementCategories()
	if (cursorMode === "Place") {
		if (global_sprites_to_place.length === 0 || global_sprites_to_place.includes("cosmoteer.delete")) {
			global_sprites_to_place = [generatePart("cosmoteer.corridor")]
		}
	} else if (cursorMode === "Delete") {
		global_sprites_to_place = []
	} else if (cursorMode === "Move") {
		global_sprites_to_place = [];
	} else if (cursorMode === "Resource") {
		global_sprites_to_place = []
		global_resources_to_place = [generateResource("bullet")];
	} else if (cursorMode === "Crew") {
		global_crew_role_to_place = crew_roles["Supply"]
	}
	if (cursorMode != "Resource") {
		global_resources_to_place = []
	}
	if (cursorMode != "Crew") {
		global_crew_role_to_place = undefined
	}
	updateCanvas()
}

function export_json() {
	// get shipdata, update shipdata.parts with sprites then export
	// drop "width" and "height" from sprite data
	new_parts = [];
	for (const sprite of sprites) {
		sprite.width = undefined;
		sprite.height = undefined;
		new_parts.push(sprite);
	}
	updateObjectExistences()
	shipdata.Doors = global_doors
	shipdata.NewFlexResourceGridTypes = global_resources
	shipdata.Parts = new_parts
	shipdata.PartUIToggleStates = global_part_properties
	shipdata.ResourceSupplierTargets = global_supply_chains
	shipdata.CrewSourceTargets = global_crew_assignments
	shipdata.PartControlGroups = global_control_groups
	shipdata.Roles = global_crew_roles
	shipdata.CrewSourceRoles = global_crew_role_sources

	for ([key, value] of getShipDataMap()) {
		shipdata[key] = value;
	}

	// convert shipdata to json
	const json = JSON.stringify(shipdata);
	// clear textarea
	document.getElementById("json_export").value = "";
	// fill textarea id="json_export" with json string
	document.getElementById("json_export").value = json;
}

function loadJson(json) {
	// Clear the sprite data
	sprites = [];
	shipdata = {};
	global_doors = [];
	global_resources = [];
	global_part_properties = [];
	if (typeof json !== 'string') {
        json = b64Input.value;
    }
	const data = JSON.parse(json);
	const part_data = Array.isArray(data.Parts) ? data.Parts : [];
	const doordata = Array.isArray(data.Doors) ? data.Doors : [];
	const crew_data = Array.isArray(data.Crew) ? data.Crew : [];
	const resource_data = Array.isArray(data.NewFlexResourceGridTypes)
		? data.NewFlexResourceGridTypes
		: [];
	const partUIToggleStates = Array.isArray(data.PartUIToggleStates)
		? data.PartUIToggleStates
		: [];

	shipdata = data;

	for (const sprite of part_data) {
		sprites.push(sprite)
	}
	
	for (const door of doordata) {
		global_doors.push(door);
	}

	for (const resource of resource_data) {
		global_resources.push(resource);
	}

	for (const toggle of partUIToggleStates) {
		global_part_properties.push(toggle);
	}

	global_crew_roles.push(...crew_data)

	updateNonVisuals()
	//place_sprites(part_data)
	global_sprites_to_draw.push(...part_data)
	updateCanvas()
}

function applyShipProperty() {
	const new_value = ship_property_edit.value;
	const toggle =
		ship_property_select.options[ship_property_select.selectedIndex].text;
	shipdata[toggle] = new_value;
	updateShipToggleSelection();
	updateCanvas();
}

function sprite_position(part) {
	position = [...(part.Location ?? part.Cell)]
	const sprite_size =
		spriteData[part.ID].sprite_size || spriteData[part.ID].size;
	const part_size = spriteData[part.ID].size;
	const part_rotation = part.Rotation;

	if (part_rotation === 0 && upTurrets.includes(part.ID)) {
		position[1] -= sprite_size[1] - part_size[1];
	} else if (part_rotation === 3 && upTurrets.includes(part.ID)) {
		position[0] -= sprite_size[1] - part_size[1];
	} else if (part_rotation === 1 && downTurrets.includes(part.ID)) {
		position[0] -= sprite_size[1] - part_size[1];
	} else if (part_rotation === 2 && downTurrets.includes(part.ID)) {
		position[1] -= sprite_size[1] - part_size[1];
	} else if (multiple_turrets.includes(part.ID)) {
		if (part.ID === "cosmoteer.thruster_small_2way") {
			if (part_rotation === 1) {
				position[0] -= 1;
			}
			if (part_rotation === 2) {
				position[0] -= 1;
				position[1] -= 1;
			}
			if (part_rotation === 3) {
				position[1] -= 1;
			}
			if (part_rotation === 1) {
				position[0] -= 1;
			}
		} else if (part.ID === "cosmoteer.thruster_small_3way") {
			if (part_rotation === 2) {
				if (part_rotation === 3) {
					position[1] -= 1;
				}
			}
		}
	}
	if (
		part.ID === "cosmoteer.missile_launcher" &&
		getPartDataMap(part).get("missile_type") !== 0
	) {
		if (part_rotation === 0) {
			position[1] -= 1;
		}
		if (part_rotation === 3) {
			position[0] -= 1;
		}
	}
	if (part.ID === "cosmoteer.door") {
		if (part.Orientation === 0) {
			position[1] -= 0.5;
		} else {
			position[0] -= 0.5;
		}
	}
	return position;
}

function getAlllocations(parts) {
	const locations = [];

	for (const part of parts) {
		for (const tile of getSpriteTileLocations(part)) {
			locations.push(tile)
		}
	}
	return locations;
}

function getAllCornerLocations(parts) {
	let tiles = getAlllocations(parts)

	for (tile of [...tiles]) {
		tiles.push([tile[0], tile[1]+1])
		tiles.push([tile[0]+1, tile[1]])
		tiles.push([tile[0]+1, tile[1]+1])
	}
	return tiles
}

function preloadSprites() {
	// Iterate over the keys (IDs) in the spriteData object
	for (const spriteID of Object.keys(spriteData)) {
		const imageName = spriteID.replace("cosmoteer.", "");
		const img = new Image();
		img.src = `sprites/parts/${imageName}.png`;
		spriteCache[imageName] = img; // Store the image in the cache
	}

	// Preload specific images for different missile types
	spriteCache.nuke_launcher = new Image();
	spriteCache.nuke_launcher.src = "sprites/parts/nuke_launcher.png";

	spriteCache.emp_launcher = new Image();
	spriteCache.emp_launcher.src = "sprites/parts/emp_launcher.png";

	spriteCache.mine_launcher = new Image();
	spriteCache.mine_launcher.src = "sprites/parts/mine_launcher.png";
}

function square_map(sprite) {
	const [x, y] = sprite_position(sprite);
	const width = Math.ceil(sprite.width / gridSize);
	const height = Math.ceil(sprite.height / gridSize);

	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			const squareX = x + i;
			const squareY = y + j;
			const key = `${squareX},${squareY}`;

			gridMap[key] = {
				square_x: squareX,
				square_y: squareY,
				is_drawn_by_sprite: sprite, // Store the sprite that is using the square
			};
		}
	}
}

function place_sprites(sprites_to_place, modify_action_history = true) {//Places the first sprites with absolute coordinates and the ones after with relative ones
	let new_parts = mirroredParts(repositionPartsRalative(sprites_to_place))
	let placed_parts = []
	if (overlappingParts(new_parts, global_recently_placed).length==0 || !global_left_mousdown_toggle) {
		for (let sprite of new_parts){
			const location = sprite.Location;
			if (sprite.ID === "cosmoteer.door") {
				const door = JSON.parse(
					`{"Cell": [${location}], "ID": "cosmoteer.door", "Orientation": ${(sprite.Rotation + 1) % 2}}`,
				);
				global_doors.push(door);
				global_doors_to_draw.push(door)
			} else {
				let overlaps = overlappingParts([sprite], sprites)
				if (overlaps.length>0) {
					remove_multiple_from_sprites(overlaps)
				}
				sprites.push(sprite);
				placed_parts.push(sprite)
				global_sprites_to_draw.push(sprite)
				let prop = generatePropertiesForPart(sprite)
				global_part_properties.push(...prop)
			}
		}
		global_recently_placed = [...new_parts]
	}
	if (modify_action_history && !(placed_parts.length === 0)) {
		addActionToHistory("add_parts", placed_parts)
	}
	updateShipStats()
	updateCanvas()
}

function placeResources(resources) {
	for (let r of mirroredResources(resources)) {
		global_resources.push(resourceCopy(r))
	}
	updateCanvas()
}

function selectParts(parts, unmirrored_parts_in) {
	let unmirrored_parts = unmirrored_parts_in || parts
	for (let part of parts) {
		for (let sprite of global_selected_sprites) {
			if (isSameSprite(sprite, part)) {
				break
			}
		}
		global_selected_sprites.push(part)
	}
	for (let part of unmirrored_parts) {
		for (let sprite of global_selected_sprites) {
			if (isSameSprite(sprite, part)) {
				break
			}
		}
		global_unmirrored_selected_sprites.push(part)
	}
	
	updateCanvas()
	updateSpriteSelection();
	handlePropertySelectionChange()
}

function remove_multiple_from_sprites(sprites_to_remove_in, modify_action_history = true) {
	let sprites_to_remove = removeDuplicates(sprites_to_remove_in, isSameSprite)
	global_sprites_to_draw = removeDuplicates(global_sprites_to_draw, isSameSprite)
	for (let sprite of sprites_to_remove) {
		remove_from_sprites(sprite);
	}
	removePartsFromKeyList(sprites_to_remove, global_crew_role_sources)
	updateShipToggleSelection()
	updateCanvas()
	updateShipStats()
	if (modify_action_history) {
		addActionToHistory("remove_parts", sprites_to_remove)
	}
}

function remove_from_sprites(sprite_to_remove) {
	const spriteToRemove = sprite_to_remove;

	for (const sprite of sprites) {
		// find the sprite in sprites and remove it
		// check id and location
		if (isSameSprite(sprite, spriteToRemove)) {
			sprites.splice(sprites.indexOf(sprite), 1);
			global_sprites_to_delete.push(sprite)
			break;
		}
	}
	
	for (const sprite of global_sprites_to_draw) {
		if (isSameSprite(sprite, spriteToRemove)) {
			global_sprites_to_draw.splice(global_sprites_to_draw.indexOf(sprite), 1);
			break;
		}
	} 
	// remove from key from gridmap
	const key_loc_x = spriteToRemove.Location[0];
	const key_loc_y = spriteToRemove.Location[1];
	for (const key in gridMap) {
		if (
			gridMap[key].is_drawn_by_sprite.Location[0] === key_loc_x &&
			gridMap[key].is_drawn_by_sprite.Location[1] === key_loc_y
		) {
			delete gridMap[key];
		}
	}
}

function removeDoors(door1) {
	let doors = mirroredParts([generateDoorAsPart(door1)])
	for (let door of doors) {
		for (let i = global_doors.length - 1; i >= 0; i--) {
			if (sameTile(global_doors[i].Cell, door.Location)) {
				global_doors_to_delete.push(global_doors[i])
				global_doors.splice(i, 1)
			}
		}
	}
	updateShipStats()
	updateCanvas()
}

function removeResources(resources) {
	let dummylist = [...global_resources];
	for (let resource of resources) {
		dummylist = dummylist.filter(
			(dummyResource) => !areLocationsSame(resource.Key, dummyResource.Key)
		);
	}
	global_resources = dummylist;
	updateCanvas();
}

function getResourceFromLocation(pos) {
	for (let i = 0; i < global_resources.length; i++) {
		if (areLocationsSame(pos, global_resources[i].Key)) {
			return global_resources[i]
		}
	}
}

function findSprite(x, y) {
	for (const sprite of sprites) {
		for (const location of getSpriteTileLocations(sprite)) {
			if (location[0] === x && location[1] === y) {
				return sprite;
			}
		}
	}

	return null;
}

function findDoor(x, y) {
	for (const door of global_doors) {
		if (door.Cell[0] === x && door.Cell[1] === y) {
			return door;
		}
	}
	return null;
}

function mousePos(event) {
	let transform = canvas.getContext("2d").getTransform()
	return mousePosConverter(event.clientX-transform.e, event.clientY-transform.f);
}

function mousePosConverter(canvasX, canvasY) {
	const rect = canvas.getBoundingClientRect();

	// Adjust for canvas transformations
	const transformedX = (canvasX - rect.left) / getScalor()[0];
	const transformedY = (canvasY - rect.top) / getScalor()[1];

	// Map to logical grid coordinates
	const logicalX = Math.floor(transformedX / gridSize) + minX;
	const logicalY = Math.floor(transformedY / gridSize) + minY;

	return [logicalX, logicalY];
}

function toggleBelongsToSprite(toggle, sprite) {
	return isSameSprite(toggle.Key[0], sprite);
}

function overlappingParts(parts1, parts2) {
	let overlapping_parts = []
	for (let part1 of parts1) {
		for (let part2 of parts2) {
			for (let location1 of getSpriteTileLocations(part1)) {
				for (let location2 of getSpriteTileLocations(part2)) {
					if (sameTile(location1, location2)) {
						overlapping_parts.push(part2)
					}
				}
			}
		} 
	} 
	return overlapping_parts
}

function repositionPartsRalative(parts) { //Uses the first part as reference and places all following parts interpreting thir location as being ralative to the first parts location
	let base = [0,0]
	toggle = true
	let new_parts = []
	for (let part of parts){
		let new_part = partCopy(part)
		if (toggle) {
			base = parts[0].Location
			toggle = false
		} else {
			new_part.Location[0] = base[0]+part.Location[0]
			new_part.Location[1] = base[1]+part.Location[1]
		}
		new_parts.push(new_part)
	}
	return new_parts
}

function absoluteToRalativePartCoordinates(parts) { //Uses the first part as reference and places all following parts interpreting thir location as being ralative to the first parts location
	let base = [0,0]
	toggle = true
	let new_parts = []
	for (let part of parts){
		let new_part = partCopy(part)
		if (toggle) {
			base = parts[0].Location
			toggle = false
		} else {
			new_part.Location[0] = part.Location[0]-base[0]
			new_part.Location[1] = part.Location[1]-base[1]
		}
		new_parts.push(new_part)
	}
	return new_parts
}

function mirroredParts(parts, also_adds_base_parts = true) {//This code is a fucking mess (but Im not gonna clean it up)
	let partsout = []
	if (also_adds_base_parts) {
		partsout = [...parts]
	}
	for (let part of parts) {
		location_rotations = mirroredPositions(partCenter(part), global_mirror_axis,global_mirror_center, false)
		for (let i = 1;i< location_rotations[0].length; i++) {
			let newpart = partCopy(part)
			newpart.FlipX = location_rotations[1][i][1]
			if (location_rotations[1][i][2]) {
				newpart.Rotation = (part.Rotation+(part.Rotation+location_rotations[1][i][0])%2*2)%4
				newpart.Location = partLocationFromCenter(location_rotations[0][i], part)
			} else {//Diagonals are a fucking mess
				if (location_rotations[1][i][0] == 0) {
					if (part.Rotation%2==0) {
						newpart.Rotation = (part.Rotation+3)%4
					} else {
						newpart.Rotation = (part.Rotation+1)%4
					}
				} else {
					if (part.Rotation%2==0) {
						newpart.Rotation = (part.Rotation+1)%4
					} else {
						newpart.Rotation = (part.Rotation+3)%4
					}
				}	
				newpart.Location = partLocationFromCenter(location_rotations[0][i], part, true)
			}
			//doors are a fucking mess
			if (newpart.ID === "cosmoteer.door") {
				if (location_rotations[1][i][0] == 0) {
					if (newpart.FlipX === true && newpart.Rotation%2 === 0) {
						newpart.Location[0] += 1
					} else if (newpart.FlipX === false && newpart.Rotation%2 === 1) {
						newpart.Location[1] += 1
					}
				} else {
					if (newpart.FlipX === true && newpart.Rotation%2 === 1) {
						newpart.Location[1] += 1
					}
				}
				if (!location_rotations[1][i][2]) {//Diagonals
					if (newpart.Rotation%2 == 1) {
						
					} else {
						if (location_rotations[1][i][0] == 0) {
							newpart.Location[0] -= 1
						} else {
							newpart.Location[0] += 1
						}
						
					}
				}
			}
			
			partsout.push(newpart)
		}
	}
	return partsout
}

function mirroredResources(resources) {
	let resourceout = [...resources]
	for (let resource of resources) {
		location_rotations = mirroredPositions(resourceCenter(resource), global_mirror_axis,global_mirror_center, false)
		for (let i = 1;i< location_rotations[0].length; i++) {
			let newresource = generateResource(resource.Value, location_rotations[0][i])
			newresource.Key =  [newresource.Key[0]-0.5, newresource.Key[1]-0.5]
			resourceout.push(newresource)
		}
	}
	return resourceout
}

function existingMirroredParts(parts, all_parts, also_adds_base_parts = true) {
	let partsout = []
	let locations = []
	if (also_adds_base_parts) {
		partsout = [...parts]
	}
	for (let part of parts) {
		location_rotations = mirroredPositions(partCenter(part), global_mirror_axis, global_mirror_center, false)
		for (let i = 1;i< location_rotations[0].length; i++) {
			locations.push(partLocationFromCenter(location_rotations[0][i], part))
		}
	}
	for (let pos of locations) {
		for (let part of all_parts) {
			if (pos[0]===part.Location[0] && pos[1]===part.Location[1]) {
				partsout.push(part)
				break
			}
		}
	}
	return partsout
}

function doIfCursorOverPart(event, code) {
	const pos = mousePos(event);
	let part = findSprite(pos[0], pos[1])
	if (part) {
		code(part);
	}
}

function doIfCursorOverDoor(event, code) {
	const pos = mousePos(event);
	let part = findDoor(pos[0], pos[1])
	if (part) {
		code(part);
	}
}

function addSupplyChains(part2, parts) {
	let part2Data = spriteData[part2.ID];
	for (let part1 of parts) {
		let part1Data = spriteData[part1.ID];

		// No chain from a part to itself
		if (!isSameSprite(part1, part2)) {
			if (part1Data.tags.includes("crew") || part2Data.tags.includes("crew")) {
				const foundItem = global_crew_assignments.find(item => isSameSprite(item.Key, part1));
				const value = foundItem ? foundItem.Value : null;
				if (value === null) {
					global_crew_assignments.push(generateSupplyChain(part1, part2));
				} else if (!value.some(sprite => isSameSprite(sprite, part2))) {//No duplicate chains
					value.push(part2);
				}
			} else {
				const foundItem = global_supply_chains.find(item => isSameSprite(item.Key, part1));
				const value = foundItem ? foundItem.Value : null;
				if (value === null) {
					global_supply_chains.push(generateSupplyChain(part1, part2));
				} else if (!value.some(sprite => isSameSprite(sprite, part2))) {//No duplicate chains
					value.push(part2);
				}
			}
		}
	}
	updateCanvas();
}

function shiftMirrorCenter(vector) {
	global_mirror_center = [global_mirror_center[0]+vector[0], global_mirror_center[1]+vector[1]]
	updateCanvas()
	drawPreview(global_sprites_to_place, global_resources_to_place)
}

function partBoundingBox(sprite) {
	const data = spriteData[sprite.ID]
	const sprite_size = data.real_size || data.sprite_size || data.size;
	let base_location = [...sprite.Location]
	if (!data.real_size && data.sprite_size) {
		let caze = (sprite.Rotation+1)%2
		if (upTurrets.includes(sprite.ID) && (sprite.Rotation === 0 || sprite.Rotation === 3)) {
			base_location[caze] = base_location[caze]-(data.sprite_size[1]-data.size[1])
		} else if (downTurrets.includes(sprite.ID) && (sprite.Rotation === 1 || sprite.Rotation === 2)) {
			base_location[caze] = base_location[caze]-(data.sprite_size[1]-data.size[1])
		}
	}
	if (sprite.Rotation % 2 === 0) {
		width = sprite_size[0];
		height = sprite_size[1];
	} else {
		width = sprite_size[1];
		height = sprite_size[0];
	}
	return [base_location, [base_location[0]+width, base_location[1]+height]];
}

function getSpriteTileLocations(sprite) {
	let box = partBoundingBox(sprite);
	let base_location = box[0];
	let bottom_right = box[1];
	let width = bottom_right[0] - base_location[0];
	let height = bottom_right[1] - base_location[1];
	let locations = [];

	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			locations.push([base_location[0] + i, base_location[1] + j]);
		}
	}
	return locations;
}

function getOneOfEach(data) {
    let parts = []
	for (let id in data) {
		parts.push(generatePart(id))
	}
    return parts
}

function resourceCenter(res) {
	return [res.Key[0]+0.5, res.Key[1]+0.5]
}

function addCrewSource(partsin, role) {
	let parts = getParts(partsin, isInTagsCondition("crew"))
	removePartsFromKeyList(parts, global_crew_role_sources)
	for (let part of parts) {
		global_crew_role_sources.push(generateRoleSource(part,role))
	}
	updateCanvas()
}

function removePartsFromKeyList(parts, list) {
	for (let part of parts) {
		for (let i=0;i<list.length;i++) {
			if (isSameSprite(part, list[i].Key)) {
				list.splice(i,1)
			}
		}
	}
}

function removeDuplicates(array, isSame) {
	let uniqueArray = [];
	for (let item of array) {
		let isUnique = true;
		for (let uniqueItem of uniqueArray) {
			if (isSame(item, uniqueItem)) {
				isUnique = false;
				break;
			}
		}
		if (isUnique) {
			uniqueArray.push(item);
		}
	}
	return uniqueArray;
}

function changeMirrorMode(mode) {
	if (mirror_select.value != "none") {
		global_previous_mirror_mode = mirror_select.value
	}
	mirror_select.value = mode
	handleMirrorSelectionChange()
}

