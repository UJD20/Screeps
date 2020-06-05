import { getRoleFromId, IRole } from "./roles";

export class EnhancedCreep
{
  constructor(creep: ICreep)
  {
    this.__creep = creep;
    this.__role = getRoleFromId(this);
  }

  private __creep: ICreep;
  private get creep(): ICreep
  {
    return this.__creep;
  }

  //#region members not on ICreep
  get roleId(): string
  {
    return this.creep.memory.roleId;
  }

  private __role: IRole;
  get role(): IRole
  {
    return this.__role;
  }
  set role(value: IRole)
  {
    this.__role = value;
  }

  act(): boolean
  {
    return this.role.act(this);
  }

  idle(): boolean
  {
    if (this.creep.memory.idleTarget)
    {
      return this.moveTo(this.creep.memory.idleTarget) === OK ? true : false;
    }
    return false;
  }

  //#endregion

  //#region extensions of ICreep

  //#region methods

  /**
 * Attack another creep or structure in a short-ranged attack. Needs the
 * ATTACK body part. If the target is inside a rampart, then the rampart is
 * attacked instead.
 *
 * The target has to be at adjacent square to the creep. If the target is a
 * creep with ATTACK body parts and is not inside a rampart, it will
 * automatically hit back at the attacker.
 *
 * @returns Result Code: OK, ERR_NOT_OWNER, ERR_BUSY, ERR_INVALID_TARGET, ERR_NOT_IN_RANGE, ERR_NO_BODYPART
 */
  attack(target: AnyCreep | Structure): CreepActionReturnCode
  {
    return this.creep.attack(target);
  }
  /**
   * Decreases the controller's downgrade or reservation timer for 1 tick per
   * every 5 `CLAIM` body parts (so the creep must have at least 5x`CLAIM`).
   *
   * The controller under attack cannot be upgraded for the next 1,000 ticks.
   * The target has to be at adjacent square to the creep.
   *
   * @returns Result Code: OK, ERR_NOT_OWNER, ERR_BUSY, ERR_INVALID_TARGET, ERR_NOT_IN_RANGE, ERR_NO_BODYPART, ERR_TIRED
   */
  attackController(target: StructureController): CreepActionReturnCode
  {
    return this.creep.attackController(target);
  }
  /**
   * Build a structure at the target construction site using carried energy.
   * Needs WORK and CARRY body parts.
   *
   * The target has to be within 3 squares range of the creep.
   *
   * @param target The target object to be attacked.
   * @returns Result Code: OK, ERR_NOT_OWNER, ERR_BUSY, ERR_NOT_ENOUGH_RESOURCES, ERR_INVALID_TARGET, ERR_NOT_IN_RANGE, ERR_NO_BODYPART, ERR_RCL_NOT_ENOUGH
   */
  build(target: ConstructionSite): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH
  {
    return this.creep.build(target);
  }
  /**
   * Cancel the order given during the current game tick.
   * @param methodName The name of a creep's method to be cancelled.
   * @returns Result Code: OK, ERR_NOT_FOUND
   */
  cancelOrder(methodName: string): OK | ERR_NOT_FOUND
  {
    return this.creep.cancelOrder(methodName);
  }

  /**
   * Requires the CLAIM body part.
   *
   * If applied to a neutral controller, claims it under your control.
   * If applied to a hostile controller, decreases its downgrade or reservation timer depending on the CLAIM body parts count.
   *
   * The target has to be at adjacent square to the creep.
   * @param target The target controller object.
   * @returns Result Code: OK, ERR_NOT_OWNER, ERR_BUSY, ERR_INVALID_TARGET, ERR_FULL, ERR_NOT_IN_RANGE, ERR_NO_BODYPART, ERR_GCL_NOT_ENOUGH
   */
  claimController(target: StructureController): CreepActionReturnCode | ERR_FULL | ERR_GCL_NOT_ENOUGH
  {
    return this.creep.claimController(target);
  }

  /**
   * Dismantles any (even hostile) structure returning 50% of the energy spent on its repair.
   *
   * Requires the WORK body part. If the creep has an empty CARRY body part, the energy is put into it; otherwise it is dropped on the ground.
   *
   * The target has to be at adjacent square to the creep.
   * @param target The target structure.
   */
  dismantle(target: Structure): CreepActionReturnCode
  {
    return this.creep.dismantle(target);
  }

  /**
   * Drop this resource on the ground.
   * @param resourceType One of the RESOURCE_* constants.
   * @param amount The amount of resource units to be dropped. If omitted, all the available carried amount is used.
   */
  drop(resourceType: ResourceConstant, amount?: number): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NOT_ENOUGH_RESOURCES
  {
    return this.creep.drop(resourceType, amount);
  }

  /**
   * Add one more available safe mode activation to a room controller. The creep has to be at adjacent square to the target room controller and have 1000 ghodium resource.
   * @param target The target room controller.
   * @returns Result Code: OK, ERR_NOT_OWNER, ERR_BUSY, ERR_NOT_ENOUGH_RESOURCES, ERR_INVALID_TARGET, ERR_NOT_IN_RANGE
   */
  generateSafeMode(target: StructureController): CreepActionReturnCode
  {
    return this.creep.generateSafeMode(target);
  }

  /**
   * Get the quantity of live body parts of the given type. Fully damaged parts do not count.
   * @param type A body part type, one of the following body part constants: MOVE, WORK, CARRY, ATTACK, RANGED_ATTACK, HEAL, TOUGH, CLAIM
   */
  getActiveBodyparts(type: BodyPartConstant): number
  {
    return this.creep.getActiveBodyparts(type);
  }

  /**
   * Harvest energy from the source or resource from minerals or deposits.
   *
   * Needs the WORK body part.
   *
   * If the creep has an empty CARRY body part, the harvested resource is put into it; otherwise it is dropped on the ground.
   *
   * The target has to be at an adjacent square to the creep.
   * @param target The source object to be harvested.
   */
  harvest(target: Source | Mineral | Deposit): CreepActionReturnCode | ERR_NOT_FOUND | ERR_NOT_ENOUGH_RESOURCES
  {
    return this.creep.harvest(target);
  }

  /**
   * Heal self or another creep. It will restore the target creep’s damaged body parts function and increase the hits counter.
   *
   * Needs the HEAL body part.
   *
   * The target has to be at adjacent square to the creep.
   * @param target The target creep object.
   */
  heal(target: AnyCreep): CreepActionReturnCode
  {
    return this.creep.heal(target);
  }

  /**
   * Move the creep one square in the specified direction or towards a creep that is pulling it.
   *
   * Requires the MOVE body part if not being pulled.
   * @param direction The direction to move in (`TOP`, `TOP_LEFT`...)
   */
  move(direction: DirectionConstant): CreepMoveReturnCode;
  move(target: ICreep): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NOT_IN_RANGE | ERR_INVALID_ARGS;
  move(moveArg: DirectionConstant | ICreep)
  {
    if (moveArg instanceof ICreep)
    {
      return this.creep.move(moveArg);
    }
    else
    {
      return this.creep.move(moveArg);
    }
  }
  
  /**
   * Move the creep using the specified predefined path. Needs the MOVE body part.
   * @param path A path value as returned from Room.findPath or RoomPosition.findPathTo methods. Both array form and serialized string form are accepted.
   */
  moveByPath(path: PathStep[] | RoomPosition[] | string): CreepMoveReturnCode | ERR_NOT_FOUND | ERR_INVALID_ARGS
  {
    return this.creep.moveByPath(path);
  }
  /**
   * Find the optimal path to the target within the same room and move to it.
   * A shorthand to consequent calls of pos.findPathTo() and move() methods.
   * If the target is in another room, then the corresponding exit will be used as a target.
   *
   * Needs the MOVE body part.
   * @param target {x, y } X and Y position of the target in the room.
   * @param opts An object containing pathfinding options flags (see Room.findPath for more info) or one of the following: reusePath, serializeMemory, noPathFinding
   */
  moveTo(target: { x: number, y: number }, opts?: MoveToOpts): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET;
  /**
   * @param target Can be a RoomPosition object or any object containing RoomPosition.
   * @param opts An object containing pathfinding options flags (see Room.findPath for more info) or one of the following: reusePath, serializeMemory, noPathFinding
   */
  moveTo(target: RoomPosition | { pos: RoomPosition }, opts?: MoveToOpts): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND;
  moveTo(target: { x: number, y: number } | RoomPosition | { pos: RoomPosition }, opts?: MoveToOpts)
  {
    // TODO: threat avoidance
    if ('x' in target && 'y' in target)
    {
      return this.creep.moveTo(target.x, target.y, opts);
    }
    else
    {
      return this.creep.moveTo(target, opts);
    }
  }

  /**
   * Toggle auto notification when the creep is under attack. The notification will be sent to your account email. Turned on by default.
   * @param enabled Whether to enable notification or disable.
   */
  notifyWhenAttacked(enabled: boolean): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_INVALID_ARGS
  {
    return this.creep.notifyWhenAttacked(enabled);
  }

  /**
   * Pick up an item (a dropped piece of energy). Needs the CARRY body part. The target has to be at adjacent square to the creep or at the same square.
   * @param target The target object to be picked up.
   */
  pickup(target: Resource): CreepActionReturnCode | ERR_FULL
  {
    return this.creep.pickup(target);
  }

  /**
   * Allow another creep to follow this creep. The fatigue generated for the target's move will be added to the creep instead of the target.
   *
   * Requires the MOVE body part. The target must be adjacent to the creep. The creep must move elsewhere, and the target must move towards the creep.
   * @param target The target creep to be pulled.
   */
  pull(target: ICreep): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_INVALID_TARGET | ERR_NOT_IN_RANGE | ERR_NO_BODYPART
  {
    return this.creep.pull(target);
  }
  /**
   * A ranged attack against another creep or structure.
   *
   * Needs the RANGED_ATTACK body part. If the target is inside a rampart, the rampart is attacked instead.
   *
   * The target has to be within 3 squares range of the creep.
   * @param target The target object to be attacked.
   */
  rangedAttack(target: AnyCreep | Structure): CreepActionReturnCode
  {
    return this.creep.rangedAttack(target);
  }
  /**
   * Heal another creep at a distance.
   *
   * It will restore the target creep’s damaged body parts function and increase the hits counter.
   *
   * Needs the HEAL body part. The target has to be within 3 squares range of the creep.
   * @param target The target creep object.
   */
  rangedHeal(target: AnyCreep): CreepActionReturnCode
  {
    return this.creep.rangedHeal(target);
  }

  /**
   * A ranged attack against all hostile creeps or structures within 3 squares range.
   *
   * Needs the RANGED_ATTACK body part.
   *
   * The attack power depends on the range to each target. Friendly units are not affected.
   */
  rangedMassAttack(): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NO_BODYPART
  {
    return this.creep.rangedMassAttack();
  }

  /**
   * Repair a damaged structure using carried energy. Needs the WORK and CARRY body parts. The target has to be within 3 squares range of the creep.
   * @param target The target structure to be repaired.
   */
  repair(target: Structure): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES
  {
    return this.creep.repair(target);
  }
  /**
   * Temporarily block a neutral controller from claiming by other players.
   *
   * Each tick, this command increases the counter of the period during which the controller is unavailable by 1 tick per each CLAIM body part.
   *
   * The maximum reservation period to maintain is 5,000 ticks.
   *
   * The target has to be at adjacent square to the creep....
   * @param target The target controller object to be reserved.
   * @return Result code: OK, ERR_NOT_OWNER, ERR_BUSY, ERR_INVALID_TARGET, ERR_NOT_IN_RANGE, ERR_NO_BODYPART
   */
  reserveController(target: StructureController): CreepActionReturnCode
  {
    return this.creep.reserveController(target);
  }
  /**
   * Display a visual speech balloon above the creep with the specified message.
   *
   * The message will disappear after a few seconds. Useful for debugging purposes.
   *
   * Only the creep's owner can see the speech message unless toPublic is true.
   * @param message The message to be displayed. Maximum length is 10 characters.
   * @param set to 'true' to allow other players to see this message. Default is 'false'.
   */
  say(message: string, toPublic?: boolean): OK | ERR_NOT_OWNER | ERR_BUSY
  {
    return this.creep.say(message, toPublic);
  }

  /**
   * Sign a controller with a random text visible to all players. This text will appear in the room UI, in the world map, and can be accessed via the API.
   * You can sign unowned and hostile controllers. The target has to be at adjacent square to the creep. Pass an empty string to remove the sign.
   * @param target The target controller object to be signed.
   * @param text The sign text. The maximum text length is 100 characters.
   * @returns Result Code: OK, ERR_BUSY, ERR_INVALID_TARGET, ERR_NOT_IN_RANGE
   */
  signController(target: StructureController, text: string): OK | ERR_BUSY | ERR_INVALID_TARGET | ERR_NOT_IN_RANGE
  {
    return this.creep.signController(target, text);
  }

  /**
   * Kill the creep immediately.
   */
  suicide(): OK | ERR_NOT_OWNER | ERR_BUSY
  {
    return this.creep.suicide();
  }

  /**
   * Transfer resource from the creep to another object. The target has to be at adjacent square to the creep.
   * @param target The target object.
   * @param resourceType One of the RESOURCE_* constants
   * @param amount The amount of resources to be transferred. If omitted, all the available carried amount is used.
   */
  transfer(target: AnyCreep | Structure, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode
  {
    return this.creep.transfer(target, resourceType, amount);
  }

  /**
   * Upgrade your controller to the next level using carried energy.
   *
   * Upgrading controllers raises your Global Control Level in parallel.
   *
   * Needs WORK and CARRY body parts.
   *
   * The target has to be at adjacent square to the creep.
   *
   * A fully upgraded level 8 controller can't be upgraded with the power over 15 energy units per tick regardless of creeps power.
   *
   * The cumulative effect of all the creeps performing upgradeController in the current tick is taken into account.
   * @param target The target controller object to be upgraded.
   */
  upgradeController(target: StructureController): ScreepsReturnCode
  {
    return this.creep.upgradeController(target);
  }
  /**
   * Withdraw resources from a structure, a tombstone or a ruin.
   *
   * The target has to be at adjacent square to the creep.
   *
   * Multiple creeps can withdraw from the same structure in the same tick.
   *
   * Your creeps can withdraw resources from hostile structures as well, in case if there is no hostile rampart on top of it.
   * @param target The target object.
   * @param resourceType The target One of the RESOURCE_* constants..
   * @param amount The amount of resources to be transferred. If omitted, all the available amount is used.
   */
  withdraw(target: Structure | Tombstone | Ruin, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode
  {
    return this.creep.withdraw(target, resourceType, amount);
  }

  //#endregion

  //#region props

  /**
   * An array describing the creep's body.
   */
  get body()
  {
    return this.creep.body;
  }

  /**
   * The movement fatigue indicator. If it is greater than zero, the creep cannot move.
   */
  get fatigue()
  {
    return this.creep.fatigue;
  }

  /**
   * The current amount of hit points of the creep.
   */
  get hits()
  {
    return this.creep.hits;
  }

  /**
   * The maximum amount of hit points of the creep.
   */
  get hitsMax()
  {
    return this.creep.hitsMax;
  }

  /**
   * A unique object identifier. You can use `Game.getObjectById` method to retrieve an object instance by its `id`.
   */
  get id()
  {
    return this.creep.id;
  }

  /**
   * A shorthand to `Memory.creeps[creep.name]`. You can use it for quick access the creep’s specific memory data object.
   */
  get memory()
  {
    return this.creep.memory;
  }

  /**
   * Whether it is your creep or foe.
   */
  get my()
  {
    return this.creep.my;
  }

  /**
   * Creep’s name. You can choose the name while creating a new creep, and it cannot be changed later. This name is a hash key to access the creep via the `Game.creeps` object.
   */
  get name()
  {
    return this.creep.name;
  }

  /**
   * An object with the creep’s owner info.
   */
  get owner()
  {
    return this.creep.owner;
  }

  /**
   * The location of the creep in its room
   */
  get pos()
  {
    return this.creep.pos;
  }

  /**
   * The link to the Room object. Always defined because creeps give visibility into the room they're in.
   */
  get room()
  {
    return this.creep.room;
  }

  /**
   * Whether this creep is still being spawned.
   */
  get spawning()
  {
    return this.creep.spawning;
  }

  /**
   * The text message that the creep was saying at the last tick.
   */
  get saying()
  {
    return this.creep.saying;
  }

  /**
   * A Store object that contains cargo of this creep.
   */
  get store()
  {
    return this.creep.store;
  }

  /**
   * The remaining amount of game ticks after which the creep will die.
   *
   * Will be `undefined` if the creep is still spawning.
   */
  ticksToLive()
  {
    return this.creep.ticksToLive;
  }

  //#endregion

  //#endregion
}
