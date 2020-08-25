export interface ITaskItem{

  getId(): number;
  setId(id: number):void;

  getName(): string;
  setName(name:string): void;

  // TODO: tutaj można inne informacje o zadaniu
}
