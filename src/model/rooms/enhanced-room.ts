import { IRole } from "model/creeps/roles";

export enum DEFCON
{
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5
}

export class EnhancedRoom
{
  constructor(room: IRoom)
  {
    this.__room = room;
    this.__defconLevel = DEFCON.ONE;
  }

  private __room: IRoom;
  private get room(): IRoom
  {
    return this.__room
  }

  private __defconLevel: DEFCON;
  public get defconLevel(): DEFCON
  {
    return this.__defconLevel;
  }
  public upgradeDefcon()
  {
    if (this.defconLevel < DEFCON.FIVE) { ++this.__defconLevel; }
    return this.defconLevel;
  }
  public downgradeDefcon()
  {
    if (this.defconLevel > DEFCON.ONE) { --this.__defconLevel; }
    return this.defconLevel;
  }

  //#region extensions of IRoom

  //#region Properties

  /**
   * The Controller structure of this room, if present, otherwise undefined.
   */
  get controller()
  {
    return this.room.controller;
  }

  /**
   * Total amount of energy available in all spawns and extensions in the room.
   */
  get energyAvailable()
  {
    return this.room.energyAvailable;
  }

  /**
   * Total amount of energyCapacity of all spawns and extensions in the room.
   */
  get energyCapacityAvailable()
  {
    return this.room.energyCapacityAvailable;
  }
  
  /**
   * A shorthand to `Memory.rooms[room.name]`. You can use it for quick access the room’s specific memory data object.
   */
  get memory()
  {
    return this.room.memory;
  }

  /**
   * One of the `MODE_*` constants.
   */
  get mode()
  {
    return this.room;
  }

  /**
   * The name of the room.
   */
  get name()
  {
    return this.room;
  }

  /**
   * The Storage structure of this room, if present, otherwise undefined.
   */
  get storage()
  {
    return this.room.storage;
  }

  /**
   * The Terminal structure of this room, if present, otherwise undefined.
   */
  get terminal()
  {
    return this.room.terminal;
  }
  /**
   * A RoomVisual object for this room. You can use this object to draw simple shapes (lines, circles, text labels) in the room.
   */
  get visual()
  {
    return this.room.visual;
  }

  //#endregion

  //#region Methods

  /**
   * Create new ConstructionSite at the specified location.
   * @param pos Can be a RoomPosition object or any object containing RoomPosition.
   * @param structureType One of the following constants: STRUCTURE_EXTENSION, STRUCTURE_RAMPART, STRUCTURE_ROAD, STRUCTURE_SPAWN, STRUCTURE_WALL, STRUCTURE_LINK
   * @returns Result Code: OK, ERR_INVALID_TARGET, ERR_INVALID_ARGS, ERR_RCL_NOT_ENOUGH
   */
  createConstructionSite(pos: RoomPosition | _HasRoomPosition, structureType: StructureConstant): ScreepsReturnCode;
  /**
   * Create new ConstructionSite at the specified location.
   * @param pos Can be a RoomPosition object or any object containing RoomPosition.
   * @param structureType One of the following constants: STRUCTURE_EXTENSION, STRUCTURE_RAMPART, STRUCTURE_ROAD, STRUCTURE_SPAWN, STRUCTURE_WALL, STRUCTURE_LINK
   * @param name The name of the structure, for structures that support it (currently only spawns).
   * @returns Result Code: OK, ERR_INVALID_TARGET, ERR_INVALID_ARGS, ERR_RCL_NOT_ENOUGH
   */
  createConstructionSite(pos: RoomPosition | _HasRoomPosition, structureType: STRUCTURE_SPAWN, name?: string): ScreepsReturnCode;
  /**
   * Create new ConstructionSite at the specified location.
   * @param x The X position.
   * @param y The Y position.
   * @param structureType One of the following constants: STRUCTURE_EXTENSION, STRUCTURE_RAMPART, STRUCTURE_ROAD, STRUCTURE_SPAWN, STRUCTURE_WALL, STRUCTURE_LINK
   * @returns Result Code: OK, ERR_INVALID_TARGET, ERR_INVALID_ARGS, ERR_RCL_NOT_ENOUGH
   */
  createConstructionSite(pos: { x: number, y: number }, structureType: BuildableStructureConstant): ScreepsReturnCode;
  /**
   * Create new ConstructionSite at the specified location.
   * @param x The X position.
   * @param y The Y position.
   * @param structureType One of the following constants: STRUCTURE_EXTENSION, STRUCTURE_RAMPART, STRUCTURE_ROAD, STRUCTURE_SPAWN, STRUCTURE_WALL, STRUCTURE_LINK
   * @param name The name of the structure, for structures that support it (currently only spawns).
   * @returns Result Code: OK, ERR_INVALID_TARGET, ERR_INVALID_ARGS, ERR_RCL_NOT_ENOUGH
   */
  createConstructionSite(pos: { x: number, y: number }, structureType: STRUCTURE_SPAWN, name?: string): ScreepsReturnCode;

  createConstructionSite(location: { x: number, y: number } | RoomPosition | _HasRoomPosition, structureType: StructureConstant | STRUCTURE_SPAWN, name?: string): ScreepsReturnCode
  {
    if (location instanceof RoomPosition || 'pos' in location)
    {
      if (structureType === "spawn")
      {
        return this.room.createConstructionSite(location, structureType, name);
      }
      else
      {
        return this.room.createConstructionSite(location, structureType);
      }
    }
    else if ('x' in location && 'y' in location && structureType === "spawn")
    {
      if (typeof name !== undefined)
      {
        return this.room.createConstructionSite(location.x, location.y, structureType, name);
      }
      else
      {
        return this.room.createConstructionSite(location.x, location.y, structureType);
      }
    }
    return ERR_INVALID_ARGS;
  }

  /**
   * Create new Flag at the specified location.
   * @param x The X position.
   * @param y The Y position.
   * @param name (optional) The name of a new flag.
   *
   * It should be unique, i.e. the Game.flags object should not contain another flag with the same name (hash key).
   *
   * If not defined, a random name will be generated.
   *
   * The maximum length is 60 characters.
   * @param color The color of a new flag. Should be one of the COLOR_* constants. The default value is COLOR_WHITE.
   * @param secondaryColor The secondary color of a new flag. Should be one of the COLOR_* constants. The default value is equal to color.
   * @returns The name of a new flag, or one of the following error codes: ERR_NAME_EXISTS, ERR_INVALID_ARGS
   */
  createFlag(location: {x: number, y: number}, name?: string, color?: ColorConstant, secondaryColor?: ColorConstant): ERR_NAME_EXISTS | ERR_INVALID_ARGS | string;
  /**
   * Create new Flag at the specified location.
   * @param pos Can be a RoomPosition object or any object containing RoomPosition.
   * @param name (optional) The name of a new flag.
   *
   * It should be unique, i.e. the Game.flags object should not contain another flag with the same name (hash key).
   *
   * If not defined, a random name will be generated.
   *
   * The maximum length is 60 characters.
   * @param color The color of a new flag. Should be one of the COLOR_* constants. The default value is COLOR_WHITE.
   * @param secondaryColor The secondary color of a new flag. Should be one of the COLOR_* constants. The default value is equal to color.
   * @returns The name of a new flag, or one of the following error codes: ERR_NAME_EXISTS, ERR_INVALID_ARGS
   */
  createFlag(location: RoomPosition | { pos: RoomPosition }, name?: string, color?: ColorConstant, secondaryColor?: ColorConstant): ERR_NAME_EXISTS | ERR_INVALID_ARGS | string;
  createFlag(location: { x: number, y: number } | RoomPosition | { pos: RoomPosition }, name?: string, color?: ColorConstant, secondaryColor?: ColorConstant): ERR_NAME_EXISTS | ERR_INVALID_ARGS | string
  {
    if ('x' in location && 'y' in location)
    {
      return this.room.createFlag(location.x, location.y, name, color, secondaryColor);
    }
    return this.room.createFlag(location, name, color, secondaryColor);
  }

  /**
   * Find all objects of the specified type in the room.
   * @param type One of the following constants:
   *  * FIND_CREEPS
   *  * FIND_MY_CREEPS
   *  * FIND_HOSTILE_CREEPS
   *  * FIND_MY_SPAWNS
   *  * FIND_HOSTILE_SPAWNS
   *  * FIND_SOURCES
   *  * FIND_SOURCES_ACTIVE
   *  * FIND_DROPPED_RESOURCES
   *  * FIND_STRUCTURES
   *  * FIND_MY_STRUCTURES
   *  * FIND_HOSTILE_STRUCTURES
   *  * FIND_FLAGS
   *  * FIND_CONSTRUCTION_SITES
   *  * FIND_EXIT_TOP
   *  * FIND_EXIT_RIGHT
   *  * FIND_EXIT_BOTTOM
   *  * FIND_EXIT_LEFT
   *  * FIND_EXIT
   * @param opts An object with additional options
   * @returns An array with the objects found.
   */
  findConstant<K extends FindConstant>(
    type: K,
    opts?: FilterOptions<K>
  ): Array<FindTypes[K]>
  {
    return this.room.find<K>(type, opts);
  }
  findStructure<T extends Structure>(
    type: FIND_STRUCTURES | FIND_MY_STRUCTURES | FIND_HOSTILE_STRUCTURES,
    opts?: FilterOptions<FIND_STRUCTURES>,
  ): T[]
  {
    return this.room.find<T>(type, opts);
  }

  /**
   * Find the exit direction en route to another room.
   * @param room Another room name or room object.
   * @returns The room direction constant, one of the following: FIND_EXIT_TOP, FIND_EXIT_RIGHT, FIND_EXIT_BOTTOM, FIND_EXIT_LEFT
   * Or one of the following error codes: ERR_NO_PATH, ERR_INVALID_ARGS
   */
  findExitTo(room: string | IRoom): ExitConstant | ERR_NO_PATH | ERR_INVALID_ARGS
  {
    return this.room.findExitTo(room);
  }

  /**
   * Find an optimal path inside the room between fromPos and toPos using A* search algorithm.
   * @param fromPos The start position.
   * @param toPos The end position.
   * @param opts (optional) An object containing additonal pathfinding flags
   * @returns An array with path steps
   */
  findPath(fromPos: RoomPosition, toPos: RoomPosition, opts?: FindPathOpts): PathStep[]
  {
    return this.room.findPath(fromPos, toPos, opts);
  }

  /**
   * Returns an array of events happened on the previous tick in this room.
   */
  getEventLog(raw?: boolean): EventItem[]
  {
    return this.room.getEventLog(raw);
  }

  /**
   * Creates a RoomPosition object at the specified location.
   * @param x The X position.
   * @param y The Y position.
   * @returns A RoomPosition object or null if it cannot be obtained.
   */
  getPositionAt(x: number, y: number): RoomPosition | null
  {
    return this.room.getPositionAt(x, y);
  }

  /**
   * Get a Room.Terrain object which provides fast access to static terrain data.
   * This method works for any room in the world even if you have no access to it.
   */
  getTerrain(): RoomTerrain
  {
    return this.room.getTerrain();
  }

  /**
   * Get the list of objects at the specified room position.
   * @param x The X position.
   * @param y The Y position.
   * @returns An array with objects at the specified position
   */
  lookAt(target: { x: number, y: number }): LookAtResult[]
  /**
   * Get the list of objects at the specified room position.
   * @param target Can be a RoomPosition object or any object containing RoomPosition.
   * @returns An array with objects at the specified position
   */
  lookAt(target: RoomPosition | { pos: RoomPosition }): LookAtResult[];
  lookAt(target: RoomPosition | { pos: RoomPosition } | { x: number, y: number }): LookAtResult[]
  {
    if ('x' in target && 'y' in target)
    {
      return this.room.lookAt(target.x, target.y);
    }
    return this.room.lookAt(target);
  }

  /**
   * Get the list of objects at the specified room area. This method is more CPU efficient in comparison to multiple lookAt calls.
   * @param top The top Y boundary of the area.
   * @param left The left X boundary of the area.
   * @param bottom The bottom Y boundary of the area.
   * @param right The right X boundary of the area.
   * @param asArray Set to true if you want to get the result as a plain array.
   * @returns An object with all the objects in the specified area
   */
  /**
   * Get the list of objects at the specified room area. This method is more CPU efficient in comparison to multiple lookAt calls.
   * @param top The top Y boundary of the area.
   * @param left The left X boundary of the area.
   * @param bottom The bottom Y boundary of the area.
   * @param right The right X boundary of the area.
   * @param asArray Set to true if you want to get the result as a plain array.
   * @returns An object with all the objects in the specified area
   */
  lookAtArea(top: number, left: number, bottom: number, right: number, asArray: true): LookAtResultMatrix | LookAtResultWithPos[]
  {
    if (asArray)
    {
      return this.room.lookAtArea(top, left, bottom, right, asArray);
    }
    return this.room.lookAtArea(top, left, bottom, right);
  }

  /**
   * Get the objects at the given position.
   * @param type One of the LOOK_* constants.
   * @param x The X position.
   * @param y The Y position.
   * @returns An array of Creep at the given position.
   */
  lookForAt<T extends keyof AllLookAtTypes>(type: T, target: { x: number, y: number }): Array<AllLookAtTypes[T]>;
  /**
   * Get the objects at the given RoomPosition.
   * @param type One of the LOOK_* constants.
   * @param target Can be a RoomPosition object or any object containing RoomPosition.
   * @returns An array of Creeps at the specified position if found.
   */
  lookForAt<T extends keyof AllLookAtTypes>(type: T, target: RoomPosition | _HasRoomPosition): Array<AllLookAtTypes[T]>;
  lookForAt<T extends keyof AllLookAtTypes>(type: T, target: { x: number, y: number } | RoomPosition | _HasRoomPosition): Array<AllLookAtTypes[T]>
  {
    if ('x' in target && 'y' in target)
    {
      return this.room.lookForAt<T>(type, target.x, target.y);
    }
    return this.room.lookForAt<T>(type, target);
  }

  /**
   * Get the given objets in the supplied area.
   * @param type One of the LOOK_* constants
   * @param top The top (Y) boundry of the area.
   * @param left The left (X) boundry of the area.
   * @param bottom The bottom (Y) boundry of the area.
   * @param right The right(X) boundry of the area.
   * @param asArray Flatten the results into an array?
   * @returns An object with the sstructure object[X coord][y coord] as an array of found objects.
   */
  /**
   * Get the given objets in the supplied area.
   * @param type One of the LOOK_* constants
   * @param top The top (Y) boundry of the area.
   * @param left The left (X) boundry of the area.
   * @param bottom The bottom (Y) boundry of the area.
   * @param right The right(X) boundry of the area.
   * @param asArray Flatten the results into an array?
   * @returns An array of found objects with an x & y property for their position
   */
  lookForAtArea<T extends keyof AllLookAtTypes>(
    type: T,
    top: number,
    left: number,
    bottom: number,
    right: number,
    asArray: true,
  ): LookForAtAreaResultArray<AllLookAtTypes[T], T>;
  lookForAtArea<T extends keyof AllLookAtTypes>(
    type: T,
    top: number,
    left: number,
    bottom: number,
    right: number,
    asArray: true,
  ): LookForAtAreaResultMatrix<AllLookAtTypes[T], T> | LookForAtAreaResultArray<AllLookAtTypes[T], T>
  {
    if (asArray)
    {
      return this.room.lookForAtArea<T>(type, top, left, bottom, right, asArray);
    }
    return this.room.lookForAtArea<T>(type, top, left, bottom, right);
  }

  /**
   * Serialize a path array into a short string representation, which is suitable to store in memory.
   * @param path A path array retrieved from Room.findPath.
   * @returns A serialized string form of the given path.
   */

  /**
   * Deserialize a short string path representation into an array form.
   * @param path A serialized path string.
   * @returns A path array.
   */
  //#endregion

  //#endregion
}
