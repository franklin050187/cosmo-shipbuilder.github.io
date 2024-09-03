//This file is for values that need to be calculated

//A collection of all the ship stats calculated once to avoid dublicate calculations
function getShipStats(parts) {
    let stats = {}
    stats.parts = parts
    stats.cost = getShipCost(stats,null, null)
    stats.command_points = getShipCommandPoints(stats, null, null)
    stats.command_cost = getShipCommandCost(stats)
    stats.crew = crewCount(stats)
    stats.weight = shipWeight(stats)
    stats.thrust = shipThrustVector(stats)
    stats.acceleration = shipAcceleration(stats, 0)
    stats.com = ship_com_location(stats)
    stats.speed = shipMaxSpeed(stats)
    stats.inertia = momentOfInertiaShip(stats)
    stats.hyperdrive_efficiency = getShipHyperdriveEfficiency(stats)
    stats.primary_weapon = getPrimaryWeaponID(stats)
    stats.connection_graph = getShipPartConnectionGraph(stats.parts)
    stats.connection_graph_partition = getConnectedComponents(stats.connection_graph[0],stats.connection_graph[1])
    return stats
} 

function getShipCost(stats, id = null, category = null) {
    sum = 0;
    //regular part price
    for (sprite of getParts(stats.parts, id, category)) {
        sum += spriteData[sprite["ID"]].cost;
    }
    //extra costs from loaded missiles
    for (toggle of part_toggles) {
        if (toggle.Key[1] == "missile_type") {
            if (toggle.Value == 0) {
                sum += 0.096;
            }
            if (toggle.Value == 1) {
                sum += 0.18;
            }
            if (toggle.Value == 2) {
                sum += 0.432;
            }
            if (toggle.Value == 3) {
                sum += 1.248;
            }
        }
    }
    //Door costs 
    for (door of doors) {
        sum += 0.1;
    }
    return sum * 1000;
}

function getShipCommandCost(stats) {
    sum = 0
    for (sprite of stats.parts) {
        if (spriteData[sprite["ID"]].cp_cost > 0) {
            sum += spriteData[sprite["ID"]].cp_cost
        }
    }
    return sum;
}

function getShipCommandPoints(stats) {
    sum = 0
    for (sprite of stats.parts) {
        if (sprite["ID"] == "cosmoteer.control_room_small") {
            sum += 50
        } else if (sprite["ID"] == "cosmoteer.control_room_med") {
            sum += 250
        } else if (sprite["ID"] == "cosmoteer.control_room_large") {
            sum += 1000
        }
    }
    return sum;
}

function crewCount(stats) {
    let sum = 0
    for (quarter of getParts(stats.parts, null, "crew")) {
        switch (quarter.ID) { 
            case "cosmoteer.crew_quarters_large": {
                sum += 24
            }
            case "cosmoteer.crew_quarters_large": {
                sum += 6
            }
            case "cosmoteer.crew_quarters_large": {
                sum += 2
            }
        }  
    }
    return sum
}

function shipWeight(stats) {
    let sum = 0
    for (sprite of stats.parts) {
        sum += spriteData[sprite["ID"]].mass
    }
    return sum * 1000
}

function part_com_location(sprite) {
	const com_location = [0, 0];
	const part_rotation = sprite.Rotation;
	const sprite_location = sprite.Location;
	part_size = spriteData[sprite.ID].size;

	if (part_rotation === 0 || part_rotation === 2) {
		com_location[0] = sprite_location[0] + part_size[0] / 2;
		com_location[1] = sprite_location[1] + part_size[1] / 2;
	} else {
		com_location[0] = sprite_location[0] + part_size[1] / 2;
		com_location[1] = sprite_location[1] + part_size[0] / 2;
	}
	return com_location;
}

function ship_com_location(stats) {
    let com = [0, 0]
    let part_com
    total_weight = stats.weight
    for (part of stats.parts) {
        part_com = part_com_location(part)
        com[0] += part_com[0]
        com[1] += part_com[1]
    }
    com[0] /= total_weight
    com[1] /= total_weight
    return com
}

//Only supports whole number angles 
function partThrustVector(part) {
    let part_rotation = part.Rotation
    let thrust_vector = [0, 0, 0, 0]
    for (i of [0, 1, 2, 3]) {
        thrust_vector[i] = spriteData[part["ID"]].thrust[(i + part_rotation + 2) % 4] * 1000000;
    }
    return thrust_vector
}

function shipThrustVector(stats) {
    let thrust_vector = [0, 0, 0, 0]
    let parts = getParts(stats.parts, null, "thruster")
    for (let part of parts) {
        let part_vector = partThrustVector(part)
        for (i of [0, 1, 2, 3]) {
            thrust_vector[i] += part_vector[i]
        }
    }
    return thrust_vector
}

function shipMaxSpeed(stats) {
    let acceleration = stats.acceleration
    for (i of Array(10000).keys()) {
        if (Math.max(i / 75, 1) ** 2 * 0.4 * i > acceleration) {
            return i;
        }
    }
    return 0
}

function shipAcceleration(stats) {
    let thrust = stats.thrust
    let mass = stats.weight
    let result = [0,0,0,0]
    for (i of [0, 1, 2, 3]) {
        result[i] += thrust[i] / mass
    }
    return result
}

function momentOfInertiaPart(part, stats) {
    let [x0, y0] = stats.com
    let location = part.Location
    let mass = spriteData[part["ID"]].mass
    return vecLength([location[0]-x0,location[1]-y0])*mass
}

function momentOfInertiaShip(stats) {
    sum = 0
    for (part of sprites) {
        sum += momentOfInertiaPart(part, stats)
    }
    return sum
}

function getShipHyperdriveEfficiency(stats) {
    let sum = 0
    for (let part of stats.parts) {
        sum +=  getTileHyperdriveEfficiency(stats, part)
    }
    return sum/stats.parts.length
}

function getTileHyperdriveEfficiency(stats, part) {
    let hyperdrives = getParts(stats.parts, null, "hyperdrive")
    let sum = 0
    let JumpEfficiency = 0.5
    let JumpEfficiencyDistanceRange = 0
    let tileDist = []
    let part_center_location = partCenter(part)

    for (drive of hyperdrives) {
        switch (drive["ID"]) {
            case ("cosmoteer.hyperdrive_small"): {
                JumpEfficiencyDistanceRange = [5,30]
                break
            }
            case ("cosmoteer.hyperdrive_med"): {
                JumpEfficiencyDistanceRange = [10,60]
                break
            }
            case ("cosmoteer.hyperdrive_large"): {
                JumpEfficiencyDistanceRange = [20,120]
                break
            }
        }
        tileDist = pointDist(partCenter(drive), part_center_location)
        sum += (1 - InverseLerp(JumpEfficiencyDistanceRange, tileDist)) * JumpEfficiency
    }
    return Math.min(sum, 1)
}

function partCenter(part) {
    let size = spriteData[part["ID"]].size
    let location = part.Location
    return [part.Location[0] + size[0]/2, part.Location[1] + size[1]/2]
}

function getAllWeaponPartGroups(statsin) {
    let parts = getParts(statsin.parts,null,"weapon")
    let parts_out = []
    let bool = true
    for (let part of parts) {
        bool = true
        for (let i = 0;i<parts_out.length;i++) {
            if (list[0] == part.ID) {
                parts_out[i].push(part)
                bool = false
            } 
        }
        if (bool) {
            parts_out.push([part.ID, part])
        }
    }
    return parts_out
}

function getPrimaryWeaponID(stats) {
    let weapon_groups = getAllWeaponPartGroups(stats)
    let sum = new Array(weapon_groups.length).fill(0)
    let part
    for (let i=0;i<weapon_groups.length;i++) {
        for (let i=1; i < group.length;i++) {
            part = group[i]
            sum[i] += spriteData[part.ID].cost
        }
    }
    index = indexOfListMax(sum)
    //return weapon_groups[index][0]
}
