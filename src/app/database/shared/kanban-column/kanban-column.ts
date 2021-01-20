import { OrderableItem } from 'app/database/shared/models/orderable.item';
import { ITaskContainer } from 'app/database/shared/task/task.container';
import { KanbanTask } from '../kanban-task/kanban-task';

export class KanbanColumn extends OrderableItem implements ITaskContainer{
  // TODO: przetestować, czy nie będzie to sprawiało problemów
  private _projectId: number;
  private _name: string;
  private _default: boolean;
  private _kanbanTasks: KanbanTask[];

  public get id(): number {
    return this._id;
  }

  public set id(id: number) {
    this._id = id;
  }

  public get projectId(): number {
    return this._projectId;
  }

  public set projectId(value: number) {
    this._projectId = value;
  }

  public get name(): string {
    if (this._name) {
      return this._name;
    }
    // TODO: przenieść to albo jakoś zmienić
    return 'Nieprzypisane';
  }

  public set name(name: string) {
    this._name = name;
  }

  public get default(): boolean {
    return this._default;
  }

  public set default(value: boolean) {
    // this._default = value ? 1 : 0;
    this._default = value;
  }

  public get kanbanTasks(): KanbanTask[] {
    return this._kanbanTasks;
  }

  public set kanbanTasks(value: KanbanTask[]) {
    this._kanbanTasks = value;
  }

  public get containerId(): number {
    return this._projectId;
  }
  public set containerId(value: number) {
    this._projectId = value;
  }
}
