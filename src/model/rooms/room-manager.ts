/**
 *
 *
 *
 *
 * */

import * as Roles from "../creeps/roles";
import * as CreepManager from "../creeps/creep-manager";
import { EnhancedCreep } from "model/creeps/enhanced-creep";

/**
  * Get a prioritized list of rooms
  */
export function prioritizedRooms(): {[priority: number]: IRoom[]}
{
  let retValue: { [priority: number]: IRoom[] } = [];
  for (const name in Game.rooms)
  {
    let room = Game.rooms[name];
    let prio = priority(room);
    if (!retValue[prio]) { retValue[prio] = []; }
    retValue[prio].push(room);
  }
  return retValue;
}

/**
  * Do maintenance tasks for this room.
  */
export function maintain(room: IRoom): void
{
  if (!room) { return; }

  let existingCreeps: Id<ICreep>[] = room.find(FIND_MY_CREEPS).map((creep) => { return creep.id; });

  let didSomething = false;
  let result: RoomActionResult = { performed: false };

  result = makeNewCreeps(room, existingCreeps);
  didSomething = result.performed;
  if (result.newCreeps) { existingCreeps.concat(result.newCreeps); }

  result = directCreeps(existingCreeps);
  didSomething = didSomething || result.performed;

  if (!didSomething) { console.log(`Nothing to do in room ${room}`); }
  return;
}

/**
 * Spawn new creeps in the room as needed
 * @param room
 */
function makeNewCreeps(room: IRoom, existingCreeps: Id<ICreep>[] | undefined): RoomActionResult
{
  let result: RoomActionResult = { performed: false, newCreeps: [] };
  existingCreeps = existingCreeps || room.find(FIND_MY_CREEPS).map((creep) => { return creep.id; });

  let spawn: StructureSpawn | null;

  // empty room
  if (existingCreeps.length === 0)
  {
    let ah = new Roles.AdvancedHarvester();
    let bh = new Roles.BasicHarvester();
    spawn = getBestSpawner(room, ah.cost());
    if (!spawn) { spawn = getBestSpawner(room, bh.cost()); }
    if (!spawn) { return { performed: false }; }
    if (CreepManager.makeCreep(bh, spawn, true))
    {
      result.performed = true;
      console.log(`Made ${bh.constructor.name} in ${room.name}`);
    }
  }

  // needs more capacity
  let upgradeRole = new Roles.BasicBuilderUpgrader();
  if (!roomHasCreep(room, [upgradeRole], undefined))
  {
    spawn = getBestSpawner(room, upgradeRole.cost());
    if (!spawn) { return { performed: false }; }
    if (CreepManager.makeCreep(upgradeRole, spawn, true))
    {
      result.performed = true;
      console.log(`Made ${upgradeRole.constructor.name} in ${room.name}`);
    }
  }

  // needs defense

  // more infrastructure

  // share state where it can expand or support other rooms

  return result;
}

/**
 * Tell the creeps in a room to do their thing
 * @param creeps
 */
function directCreeps(creeps: Id<ICreep>[]): RoomActionResult
{
  let result: RoomActionResult = { performed: false };
  if (!creeps) { return result; }
  const acted: Id<ICreep>[] = creeps.filter(
    (creepId: Id<ICreep>, creepIdx: number, creeps: Id<ICreep>[]) =>
    {
      const creep: ICreep | null = Game.getObjectById(creepId);
      if (creep === null) { return; }
      const ec: EnhancedCreep = new EnhancedCreep(creep);
      const performed: boolean = ec.act();
      return { performed: performed };
    });
  result.performed = acted && acted.length > 0;
  return result;
}

export declare type RoomActionResult =
{
  performed: boolean,
  newCreeps?: Id<ICreep>[]
}
  

/**
  * Determine the priority of this room in the processing order
  */
export function priority(room: IRoom): number
{
  let prio: number = 0;
  if (roomHasCreep(room)) { ++prio; }
  return prio;
}

/**
  * Check if there are any creeps in this room
  */
export function roomHasCreep(room: IRoom, roles?: Roles.IRole[], parts?: BodyPartConstant[]): boolean
{
  let creepsInRoom: ICreep[] | EnhancedCreep[] = room.find(FIND_MY_CREEPS);
  if (!parts && !roles)
  {
    if (!creepsInRoom) { return false; }
    return (creepsInRoom.length > 0);
  }
  creepsInRoom = creepsInRoom.map(creep => new EnhancedCreep(creep));
  if (roles && roles.length > 0)
  {
    CreepManager.creepsWithRoles(creepsInRoom, roles);
  }
  if (parts && parts.length > 0)
  {
    CreepManager.creepsWithBodyParts(creepsInRoom, parts);
  }
  return (creepsInRoom.length > 0);
}

/**
 * 
 * @param room
 * @param cost
 */
  function getBestSpawner(room: IRoom, cost: number): StructureSpawn | null
  {
    if (!room) { return null; }
    const spawnFilterFunction: FilterFunction<FIND_MY_SPAWNS> = (spawn: StructureSpawn) =>
    {
      return (spawn.isActive() && spawn.my && spawn.spawning === null /*&& spawn.store[RESOURCE_ENERGY] >= cost*/);
    }
    const spawnFilterOptions: FilterOptions<FIND_MY_SPAWNS> =
    {
      filter: spawnFilterFunction
    }
    const spawners = room.find(FIND_MY_SPAWNS, spawnFilterOptions);

    if (spawners.length === 0) { return null; }
    if (spawners.length === 1) { return spawners[0]; }

    let spawn: StructureSpawn;
    let prioritizedSpawns: { [energy: number]: StructureSpawn[] } = {};
    for (let spawnIndex = 0; spawnIndex < spawners.length; spawnIndex++)
    {
      spawn = spawners[spawnIndex];
      let energy: number = spawn.store[RESOURCE_ENERGY];
      if (energy === cost) { return spawn; }
      if (!prioritizedSpawns[energy]) { prioritizedSpawns[energy] = []; }
      prioritizedSpawns[energy].push(spawn);
    }

    let lowestEnergy: number = Math.min.apply(null, Object.keys(prioritizedSpawns).map((key) => { return Number(key); }));
    if (!isNaN(lowestEnergy)) { return prioritizedSpawns[lowestEnergy][0]; }

    return null;
  }
