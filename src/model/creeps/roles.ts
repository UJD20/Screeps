import { Creeps } from "config/config";
import { EnhancedCreep } from "./enhanced-creep";
import { create } from "domain";
import { creepsWithBodyParts } from "./creep-manager";

/**
 *
 * @module Roles
 */

//#region bases

interface IRole
{
  id: string;
  bodyTemplate: BodyPartConstant[];
  fightOrFlight: FightOrFlight;
  act(creep: EnhancedCreep): boolean;
  cost(): number
  newId(): string;
}

/**
 * Gets a role object from the role id assigned to the creep
 * @param creep EnhancedCreep with memory for roleId
 */
function getRoleFromId(creep: EnhancedCreep): IRole
{
  const id: string = creep.memory.roleId;
  switch (id)
  {
    case '1':
      return new BasicHarvester();
    case '2':
      return new AdvancedHarvester();
    case '3':
      return new BasicBuilderUpgrader();
    default:
      break;
  }
  throw Error(`Creep has no role ${creep.toString()}`);
}

enum FightOrFlight
{
  Flight = 0,
  Fight = 1
}

interface ICreepActionProperties
{
  creep: ICreep
}

abstract class RoleBase implements IRole
{
  abstract id: string;

  // The body parts making up the role
  abstract bodyTemplate: BodyPartConstant[];

  abstract fightOrFlight: FightOrFlight;

  // Perform actions for the tick
  abstract act(creep: EnhancedCreep): boolean;

  // The expense of the role
  cost(): number
  {
    const parts: BodyPartConstant[] = this.bodyTemplate;
    let costs: number[] = parts.map((part) => { return BODYPART_COST[part]; });
    let sum: number = costs.reduce((total, next) => { return total + next; })
    return sum;
  }

  // Generate the next ID for the role
  newId(): string
  {
    const type: string = this.constructor.name;
    if (!Memory.creepIds) { Memory.creepIds = {}; }
    if (!Memory.creepIds[type]) { Memory.creepIds[type] = 0; }
    const nextId: number = ++(Memory.creepIds[type]);
    return `${type}${nextId.toString()}`;
  }
}

//#endregion

//#region workers

abstract class WorkerBase extends RoleBase
{
  constructor()
  {
    super();
  }
  fightOrFlight = FightOrFlight.Flight;
  abstract act(creep: EnhancedCreep): boolean;
}

//#region harvest

class BasicHarvester extends WorkerBase
{
  constructor()
  {
    super();
  }
  id: string = "1";
  bodyTemplate = [MOVE, WORK, CARRY];
  act(creep: EnhancedCreep){ return harvesterAct(creep); }
}

/**
 * 
 */
class AdvancedHarvester extends WorkerBase
{
  constructor()
  {
    super();
  }
  id: string = "2";
  bodyTemplate = [MOVE, MOVE, WORK, WORK, CARRY, CARRY];
  act(creep: EnhancedCreep) { return harvesterAct(creep); }
}

function harvesterAct(creep: EnhancedCreep): boolean
{
  if (!creep) { return false; }  

  const ff: FilterFunction<FIND_SOURCES> = (src): boolean =>
  {
    return src.energy > 0 ? true : false;
  };
  const fo: FilterOptions<FIND_SOURCES> =
  {
    filter: ff
  }

  if (creep.store.getFreeCapacity() > 0)
  {
    // if we've got room but can't carry, we can't do anything
    if (creep.getActiveBodyparts(CARRY) < 1) { return creep.idle(); }

    const harvestSource: Source | null = creep.pos.findClosestByPath<FIND_SOURCES>(FIND_SOURCES, fo);
    if (harvestSource != null)
    {
      // if we can't work, we can't harvest.
      if (creep.getActiveBodyparts(WORK) < 1)
      {
        return creep.idle();
      }
      const tryHarvest: ScreepsReturnCode = creep.harvest(harvestSource);
      if (tryHarvest === ERR_NOT_IN_RANGE)
      {
        // if we're not in range of a source but can't move, we can't do anything
        if (creep.getActiveBodyparts(MOVE) < 1) { return false; }
        creep.moveTo(harvestSource);
      }
      else if (tryHarvest === ERR_NO_BODYPART)
      {

        creep.say("need healing");
      }
    } 
    else
    {
      // no sources available
      creep.say("nothing to do");
      creep.moveTo(Game.spawns['Spawn1']);
    }
  }
  else
  {
    if (creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
    {
      creep.moveTo(Game.spawns['Spawn1']);
    }
  }

  return true;
}

//#endregion

//#region mechanic

class BasicBuilderUpgrader extends WorkerBase
{
  id: string = "3";
  bodyTemplate = [MOVE, MOVE, WORK, CARRY];
  public act(creep: EnhancedCreep): boolean { return builderAct(creep); }
}

function builderAct(creep: EnhancedCreep): boolean
{
  // build stuff if needed


  // otherwise harvest
  return harvesterAct(creep);
}

//#endregion

//#endregion

//#region fighters

abstract class FighterBase extends RoleBase
{
  fightOrFlight = FightOrFlight.Fight;
  act(): boolean
  {
    return true;
  }
}

class Explorer extends FighterBase
{
  id: string = "4";
  bodyTemplate = [TOUGH, TOUGH, MOVE, MOVE, MOVE];
}

class Scout extends FighterBase
{
  id: string = "5";
  bodyTemplate = [MOVE, MOVE, MOVE, MOVE];
}

class Runner extends FighterBase
{
  id: string = "6";
  bodyTemplate = [MOVE, MOVE, MOVE, CARRY];
}

abstract class SoldierBase extends FighterBase
{

}

class Skirmisher extends SoldierBase
{
  id: string = "7";
  bodyTemplate = [TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK];
}

class Squire extends SoldierBase
{
  id: string = "8";
  bodyTemplate = [MOVE, MOVE, ATTACK, ATTACK]
}

class Viking extends SoldierBase
{
  id: string = "9";
  bodyTemplate = [TOUGH, TOUGH, MOVE, MOVE, MOVE, ATTACK, ATTACK]
}

class Gunman extends SoldierBase
{
  id: string = "10";
  bodyTemplate = [TOUGH, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK];
}

class Sniper extends SoldierBase
{
  id: string = "11";
  bodyTemplate = [MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK];
}

class Healer extends SoldierBase
{
  id: string = "12";
  bodyTemplate = [MOVE, MOVE, HEAL, HEAL];
}

class BattleCleric extends SoldierBase
{
  id: string = "13";
  bodyTemplate = [TOUGH, TOUGH, MOVE, MOVE, HEAL, HEAL];
}

//#endregion

export
{
  getRoleFromId,

  IRole,
  ICreepActionProperties,

  BasicHarvester,
  AdvancedHarvester,

  BasicBuilderUpgrader,

  Explorer,
  Scout,
  Skirmisher,

  Squire,
  Viking,

  Gunman,
  Sniper,

  Healer,
  BattleCleric
}
