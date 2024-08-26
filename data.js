const spriteData = {
    "cosmoteer.corridor": { "mass": 1, "size": [1, 1], "cost": 0.1, "category": "" },
    "cosmoteer.door": { "size": [1, 1], "cost": 0.1, "category": "" },
    "cosmoteer.delete": { "mass": 1, "size": [1, 1] },
    "cosmoteer.structure": { "mass": 0.33, "size": [1, 1], "cost": 0.05, "category": "" },
    "cosmoteer.structure_wedge": { "mass": 0.17, "size": [1, 1], "cost": 0.025, "category": "" },
    "cosmoteer.structure_1x2_wedge": { "mass": 0.33, "size": [1, 2], "cost": 0.05, "category": "" },
    "cosmoteer.structure_1x3_wedge": { "mass": 0.5, "size": [1, 3], "cost": 0.075, "category": "" },
    "cosmoteer.structure_tri": { "mass": 0.08, "size": [1, 1], "cost": 0.025, "category": "" },
    "cosmoteer.laser_blaster_small": { "mass": 2.5, "size": [1, 2], "sprite_size": [1, 4], "dps": 667, "burst_damage": 500, "cost": 2, "category": "weapon", "cp_cost": 2 },
    "cosmoteer.laser_blaster_large": { "mass": 7.68, "size": [2, 3], "sprite_size": [2, 6], "dps": 1778, "burst_damage": 1000, "cost": 6, "category": "weapon", "cp_cost": 4 },
    "cosmoteer.disruptor": { "mass": 3.48, "size": [1, 3], "sprite_size": [1, 5], "dps": 100, "burst_damage": 200, "cost": 3, "category": "weapon", "cp_cost": 2 },
    "cosmoteer.ion_beam_emitter": { "mass": 8, "size": [2, 4], "sprite_size": [2, 5], "dps": 2500, "burst_damage": 0, "cost": 10, "category": "weapon", "cp_cost": 4 },
    "cosmoteer.resource_collector": { "mass": 4, "size": [2, 2], "cost": 0, "category": "", "cp_cost": 4 },
    "cosmoteer.ion_beam_prism": { "mass": 7.7, "size": [2, 2], "sprite_size": [2, 2.5], "cost": 5, "category": "", "cp_cost": 2 },
    "cosmoteer.tractor_beam_emitter": { "mass": 32.07, "size": [5, 5], "cost": 40, "category": "", "cp_cost": 8 },
    "cosmoteer.point_defense": { "mass": 1, "size": [1, 1], "sprite_size": [1, 2], "dps": 525, "burst_damage": 35, "cost": 1, "category": "weapon", "cp_cost": 1 },
    "cosmoteer.mining_laser_small": { "mass": 7.4, "size": [2, 3], "dps": 1200, "burst_damage": 0, "cost": 6, "category": "weapon", "cp_cost": 3 },
    "cosmoteer.cannon_med": { "mass": 4.44, "size": [2, 1], "sprite_size": [2, 3], "dps": 1000, "burst_damage": 750, "cost": 2, "category": "weapon", "cp_cost": 2 },
    "cosmoteer.sensor_array": { "mass": 11.54, "size": [3, 3], "cost": 20, "category": "", "cp_cost": 8 },
    "cosmoteer.cannon_large": { "mass": 12.29, "size": [3, 2], "sprite_size": [3, 5], "dps": 2000, "burst_damage": 2400, "cost": 5, "category": "weapon", "cost": 0, "category": "", "cp_cost": 4 },
    "cosmoteer.hyperdrive_beacon": { "mass": 17.13, "size": [4, 4], "cost": 40, "category": "", "cp_cost": 12 },
    "cosmoteer.cannon_deck": { "mass": 27.07, "size": [4, 5], "sprite_size": [4, 7], "dps": 6000, "burst_damage": 7500, "cost": 20, "category": "weapon", "cp_cost": 8 },
    "cosmoteer.explosive_charge": { "mass": 1, "size": [1, 1], "cost": 0.6, "category": "" },
    "cosmoteer.roof_light": { "mass": 1, "size": [1, 1], "cost": 0.2, "category": "" },
    "cosmoteer.missile_launcher": { "mass": 8, "size": [2, 3], "sprite_size": [2, 4], "dps": 0, "burst_damage": 0, "cost": 10, "category": "", "cp_cost": 5 },
    "cosmoteer.roof_headlight": { "mass": 1, "size": [1, 1], "cost": 0.3, "category": "" },
    "cosmoteer.railgun_loader": { "mass": 24, "size": [2, 3], "cost": 12.5, "category": "", "cp_cost": 4 },
    "cosmoteer.armor_structure_hybrid_1x1": { "mass": 1.5, "size": [1, 1], "cost": 0.125, "category": "" },
    "cosmoteer.armor_structure_hybrid_1x2": { "mass": 3, "size": [1, 2], "cost": 0.25, "category": "" },
    "cosmoteer.railgun_accelerator": { "mass": 36, "size": [2, 3], "cost": 7.5, "category": "", "cp_cost": 1 },
    "cosmoteer.armor_structure_hybrid_1x3": { "mass": 4.5, "size": [1, 3], "cost": 0.375, "category": "" },
    "cosmoteer.armor_structure_hybrid_tri": { "mass": 1, "size": [1, 1], "cost": 0.075, "category": "" },
    "cosmoteer.railgun_launcher": { "mass": 36, "size": [2, 3], "sprite_size": [2, 4], "dps": 10000, "burst_damage": 2500, "cost": 7.5, "category": "weapon", "cp_cost": 1 },
    "cosmoteer.armor": { "mass": 3, "size": [1, 1], "cost": 0.2, "category": "" },
    "cosmoteer.armor_2x1": { "mass": 6, "size": [2, 1], "cost": 0.4, "category": "" },
    "cosmoteer.flak_cannon_large": { "mass": 16.77, "size": [3, 6], "sprite_size": [3, 8], "dps": 9, "burst_damage": 2250, "cost": 21, "category": "weapon", "cp_cost": 6 },
    "cosmoteer.armor_wedge": { "mass": 1.5, "size": [1, 1], "cost": 0.1, "category": "" },
    "cosmoteer.armor_1x2_wedge": { "mass": 3, "size": [1, 2], "cost": 0.2, "category": "" },
    "cosmoteer.shield_gen_small": { "mass": 6, "size": [2, 2], "sprite_size": [2, 3], "cost": 5, "category": "", "cp_cost": 3 },
    "cosmoteer.armor_1x3_wedge": { "mass": 4.5, "size": [1, 3], "cost": 0.3, "category": "" },
    "cosmoteer.armor_tri": { "mass": 0.75, "size": [1, 1], "cost": 0.05, "category": "" },
    "cosmoteer.shield_gen_large": { "mass": 12.65, "size": [3, 6], "cost": 20, "category": "", "cp_cost": 6 },
    "cosmoteer.thruster_small": { "mass": 1.3, "size": [1, 1], "sprite_size": [1, 2], "cost": 0.5, "category": "thruster", "cp_cost": 1, "thrust": [0, 0, 0.4, 0] },
    "cosmoteer.thruster_med": { "mass": 2.45, "size": [1, 2], "sprite_size": [1, 3], "cost": 1.5, "category": "thruster", "cp_cost": 2, "thrust": [0, 0, 1.2, 0] },
    "cosmoteer.thruster_large": { "mass": 4.99, "size": [2, 2], "sprite_size": [2, 3], "cost": 4, "category": "thruster", "cp_cost": 4, "thrust": [0, 0, 3.2, 0] },
    "cosmoteer.thruster_boost": { "mass": 8.88, "size": [2, 3], "sprite_size": [2, 5], "cost": 6, "category": "thruster", "cp_cost": 6, "thrust": [0, 0, 3.2, 0] },
    "cosmoteer.fire_extinguisher": { "mass": 1, "size": [1, 1], "cost": 0.3, "category": "" },
    "cosmoteer.thruster_huge": { "mass": 11, "size": [3, 3], "sprite_size": [3, 5], "cost": 10, "category": "thruster", "cp_cost": 8, "thrust": [0, 0, 8, 0] },
    "cosmoteer.control_room_small": { "mass": 4, "size": [2, 2], "cost": 10, "category": "", "cp_cost": 0 },
    "cosmoteer.control_room_med": { "mass": 9, "size": [3, 3], "cost": 25, "category": "", "cp_cost": 0 },
    "cosmoteer.thruster_small_2way": { "mass": 1.61, "size": [1, 1], "sprite_size": [2, 2], "cost": 1, "category": "thruster", "cp_cost": 2, "thrust": [0, 0.4, 0.4, 0] },
    "cosmoteer.control_room_large": { "mass": 16, "size": [4, 4], "cost": 50, "category": "", "cp_cost": 0 },
    "cosmoteer.thruster_small_3way": { "mass": 1.91, "size": [1, 1], "sprite_size": [3, 2], "cost": 1.5, "category": "thruster", "cp_cost": 3, "thrust": [0, 0.4, 0.4, 0.4] },
    "cosmoteer.hyperdrive_small": { "mass": 4, "size": [2, 2], "cost": 10, "category": "hyperdrive" },
    "cosmoteer.engine_room": { "mass": 9, "size": [3, 3], "cost": 12, "category": "", "cp_cost": 6 },
    "cosmoteer.crew_quarters_small": { "mass": 2, "size": [1, 2], "cost": 1.6, "category": "crew" },
    "cosmoteer.crew_quarters_med": { "mass": 4, "size": [2, 2], "cost": 4.2, "category": "crew" },
    "cosmoteer.airlock": { "mass": 1, "size": [1, 1], "cost": 0.6, "category": "" },
    "cosmoteer.conveyor": { "mass": 1, "size": [1, 1], "cost": 0.2, "category": "" },
    "cosmoteer.reactor_small": { "mass": 4, "size": [2, 2], "cost": 25, "category": "" },
    "cosmoteer.reactor_med": { "mass": 9, "size": [3, 3], "cost": 50, "category": "" },
    "cosmoteer.reactor_large": { "mass": 16, "size": [4, 4], "cost": 75, "category": "" },
    "cosmoteer.power_storage": { "mass": 4, "size": [2, 2], "cost": 4, "category": "" },
    "cosmoteer.factory_ammo": { "mass": 4, "size": [2, 2], "cost": 4.1, "category": "", "cp_cost": 1 },
    "cosmoteer.factory_he": { "mass": 9, "size": [3, 3], "cost": 15.2, "category": "", "cp_cost": 1 },
    "cosmoteer.factory_emp": { "mass": 12, "size": [3, 4], "cost": 20.5, "category": "", "cp_cost": 1 },
    "cosmoteer.factory_nuke": { "mass": 16, "size": [4, 4], "cost": 27.1, "category": "", "cp_cost": 1 },
    "cosmoteer.factory_mine": { "mass": 12, "size": [4, 3], "cost": 20.18, "category": "", "cp_cost": 1 },
    "cosmoteer.factory_steel": { "mass": 16, "size": [4, 4], "cost": 30.4, "category": "", "cp_cost": 1 },
    "cosmoteer.factory_coil": { "mass": 9, "size": [3, 3], "cost": 30.8, "category": "", "cp_cost": 1 },
    "cosmoteer.factory_coil2": { "mass": 12, "size": [4, 3], "cost": 54.8, "category": "", "cp_cost": 1 },
    "cosmoteer.factory_tristeel": { "mass": 16, "size": [4, 4], "cost": 68.2, "category": "", "cp_cost": 1 },
    "cosmoteer.factory_diamond": { "mass": 6, "size": [2, 3], "cost": 53.2, "category": "", "cp_cost": 1 },
    "cosmoteer.factory_processor": { "mass": 9, "size": [3, 3], "cost": 89, "category": "", "cp_cost": 1 },
    "cosmoteer.factory_uranium": { "mass": 12, "size": [3, 4], "cost": 98, "category": "", "cp_cost": 1 },
    "cosmoteer.storage_2x2": { "mass": 4, "size": [2, 2], "cost": 1.2, "category": "" },
    "cosmoteer.storage_3x2": { "mass": 6, "size": [3, 2], "cost": 1.8, "category": "" },
    "cosmoteer.storage_3x3": { "mass": 9, "size": [3, 3], "cost": 2.7, "category": "" },
    "cosmoteer.storage_4x3": { "mass": 12, "size": [4, 3], "cost": 3.6, "category": "" },
    "cosmoteer.storage_4x4": { "mass": 16, "size": [4, 4], "cost": 4.8, "category": "" },
    "cosmoteer.chaingun": { "mass": 17.77, "size": [3, 5], "sprite_size": [3, 7], "dps": 18000, "burst_damage": 0, "cost": 24, "category": "weapon", "cp_cost": 6 },
    "cosmoteer.chaingun_magazine": { "mass": 2, "size": [1, 2], "cost": 1, "category": "" },
    "cosmoteer.hyperdrive_large": { "mass": 16, "size": [4, 4], "cost": 34, "category": "hyperdrive" },
    "cosmoteer.thruster_rocket_battery": { "mass": 2, "size": [1, 2], "cost": 3, "category": "" },
    "cosmoteer.thruster_rocket_extender": { "mass": 6, "size": [3, 2], "cost": 6, "category": "thruster", "thrust": [0, 0, 8, 0] },
    "cosmoteer.thruster_rocket_nozzle": { "mass": 14.4, "size": [3, 4], "sprite_size": [3, 5], "cost": 15, "category": "thruster", "cp_cost": 16, "thrust": [0, 0, 8, 0] },
    "cosmoteer.hyperdrive_med": { "mass": 9, "size": [3, 3], "cost": 20, "category": "hyperdrive" },
    "cosmoteer.manipulator_beam_emitter": { "mass": 4, "size": [2, 2], "cost": 3, "category": "", "cp_cost": 4 },
    "cosmoteer.crew_quarters_large": { "mass": 12, "size": [3, 4], "cost": 15.6, "category": "crew" }
};
const upTurrets = [
    "cosmoteer.laser_blaster_small",
    "cosmoteer.laser_blaster_large",
    "cosmoteer.disruptor",
    "cosmoteer.ion_beam_emitter",
    "cosmoteer.ion_beam_prism",
    "cosmoteer.point_defense",
    "cosmoteer.cannon_med",
    "cosmoteer.cannon_large",
    "cosmoteer.cannon_deck",
    "cosmoteer.missile_launcher",
    "cosmoteer.railgun_launcher",
    "cosmoteer.flak_cannon_large",
    "cosmoteer.shield_gen_small",
    "cosmoteer.chaingun",
]
const downTurrets = [
    "cosmoteer.thruster_small",
    "cosmoteer.thruster_med",
    "cosmoteer.thruster_large",
    "cosmoteer.thruster_huge",
    "cosmoteer.thruster_boost",
]