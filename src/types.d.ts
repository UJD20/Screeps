// memory extension samples

interface Memory
{
  uuid: number;
  log: any;
  creepIds: { [type: string]: number };
}

declare interface CreepMemory
{
  roleId: string,
  idleTarget?: RoomObject
}
declare interface FlagMemory { [name: string]: any }
declare interface SpawnMemory { [name: string]: any }
declare interface RoomMemory { [name: string]: any }

// `global` extension samples
declare namespace NodeJS
{
  interface Global
  {
    log: any;
  }
}
