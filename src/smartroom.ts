
export class SmartRoom extends Room
{

  /**
   * Get a prioritized list of rooms
   */
  public static prioritizedRooms(): {[priority: number]: SmartRoom[]}
  {
    let retValue: { [priority: number]: SmartRoom[] } = [];
    for (const name in Game.rooms)
    {
      let room = Game.rooms[name] as SmartRoom;
      let prio = room.priority();
      if (!retValue[prio]) { retValue[prio] = []; }
      retValue[prio].push(room);
    }
    return retValue;
  }

  /**
   * Do maintenance tasks for this room.
   */
  public maintain(): void
  {
    const creeps = this.creeps();
    if (creeps.length === 0)
    {

    }
  }

  /**
   * Determine the priority of this room in the processing order
   */
  public priority(): number
  {
    let prio: number = 0;
    if (this.hasCreeps()) { ++prio; }
    return prio;
  }

  /**
   * Check if there are any creeps in this room
   */
  private hasCreeps(): boolean
  {
    return (this.creeps(true).length > 0);
  }

  /**
   * Get an array of creeps in this room
   * @param existence If true, return the list after the first creep is found.
   */
  public creeps(existence: boolean): Creep[]
  {
    let list: Creep[] = [];
    for (const name in Game.creeps)
    {
      const creep = Game.creeps[name];
      if (creep.room === this)
      {
        list.push(creep);
        if (existence) { return list; }
      }
    }
    return list;
  }

  private getBestSpawner(): Structure<STRUCTURE_SPAWN>
  {
    return null;
  }
}
