export interface Command{
  execute():void;
  unExecute():void;
  getDescription(): string
}
