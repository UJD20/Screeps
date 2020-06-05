import { IRole, getRoleFromId } from "./roles";import { EnhancedCreep } from "./enhanced-creep";
import { RoomActionResult } from "../rooms/room-manager";
import { Creeps } from "config/config";
/// <reference path="types.d.ts" />


export function makeCreep<T extends IRole>(role: T, spawner: StructureSpawn, retry?: boolean): RoomActionResult
{
  debugger;
  const retryLimit: number = 20;
  let tries: number = 0;
  let success: ScreepsReturnCode | undefined;
  const opts: SpawnOptions = { memory: { roleId: role.id, idleTarget: spawner } };
  const nameToUse: string = role.newId();
  while (success !== OK && ++tries <= retryLimit)
  {
    success = spawner.spawnCreep(role.bodyTemplate, nameToUse, opts);
    if (success === ERR_NOT_OWNER || success === ERR_RCL_NOT_ENOUGH) { throw new Error(`Invalid spawner for ${typeof role}`); }
    if (!retry && success !== OK) { return { performed: false}; }
  }
  let newCreeps: ICreep[] = [];
  newCreeps.push(Game.creeps[nameToUse]);
  return { performed: success === OK, newCreeps: newCreeps.map(creep => creep.id)};
}

/**
 * Takes an array of creeps and an array of roles.
 * Removes from the array of creeps any that don't have one of the roles.
 * NOTE: this is a destructive process on creeps
 * @param creeps Creeps to search through
 * @param roles Roles to check for
 */
export function creepsWithRoles(creeps: EnhancedCreep[], roles: IRole[]): void
{
  creeps.forEach((creep, creepIdx) =>
  {
    if (roles.indexOf(getRoleFromId(creep)) < 0)
    {
      creeps.splice(creepIdx, 1);
    }
  });
}

/**
 * Takes an array of creeps and an array of body part constants.
 * Removes from the array of creeps any that don't have all of the body part constants,
 * including duplicates.
 * NOTE: this is a destructive process on creeps
 * @param creeps Creeps to search through
 * @param parts Body part constants to require
 */
export function creepsWithBodyParts(creeps: EnhancedCreep[], parts: BodyPartConstant[]): void
{
  creeps.forEach((creep, creepIdx) =>
    {
      let creepParts: BodyPartConstant[] = creep.body.map(part => part.type);
      let partsToFind: BodyPartConstant[] = parts.map(part => part);
      partsToFind.forEach((part, partIdx) =>
      {
        let hasPartIdx = creepParts.indexOf(part);
        if (hasPartIdx >= 0)
        {
          creepParts.splice(hasPartIdx, 1);
          partsToFind.splice(partIdx, 1);
        }
      });
      if (partsToFind.length === 0)
      {
        creeps.splice(creepIdx, 1);
      }
    });
}
