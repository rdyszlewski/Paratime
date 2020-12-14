import { OrderableItem } from 'app/database/shared/models/orderable.item';
import { ITaskContainer } from 'app/database/shared/task/task.container';
import { KanbanTask } from '../kanban-task/kanban-task';

export class KanbanColumn extends OrderableItem implements ITaskContainer{
  // TODO: przetestować, czy nie będzie to sprawiało problemów
  private projectId: number;
  private name: string;
  private default: number = 0;
  private kanbanTasks: KanbanTask[];

  public getId(): number {
    return this.id;
  }

  public setId(id: number) {
    this.id = id;
  }

  public getProjectId(): number {
    return this.projectId;
  }

  public setProjectId(projectId: number) {
    this.projectId = projectId;
  }

  public getName(): string {
    if (this.name) {
      return this.name;
    }
    // TODO: przenieść to albo jakoś zmienić
    return 'Nieprzypisane';
  }

  public setName(name: string) {
    this.name = name;
  }

  public isDefault(): boolean {
    return this.default == 1;
  }

  public setDefault(def: boolean) {
    this.default = def ? 1 : 0;
  }

  public getKanbanTasks(): KanbanTask[] {
    return this.kanbanTasks;
  }

  public setKanbanTasks(kanbanTasks: KanbanTask[]) {
    this.kanbanTasks = kanbanTasks;
  }

  public getContainerId(): number {
    return this.getProjectId();
  }
  public setContainerId(id: number): void {
    this.setProjectId(id);
  }
}
