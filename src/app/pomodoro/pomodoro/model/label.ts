export interface IPomodoroLabels{
  getId(): number;
  getName(): string;
}

export class PomodoroLabel implements IPomodoroLabels{

  private _id: number;
  private _name: string;

  constructor(id: number, name: string){
    this._id = id;
    this._name = name;
  }

  public getId(): number {
    return this._id;
  }

  public getName(): string {
    return this._name;
  }

}
