import { Project } from 'app/models/project';
import { IProjectRepository } from '../repositories/project_repository';
import { TaskStore } from './task_store';
import { StageStore } from './stage_store';
import { KanbanColumn } from 'app/models/kanban';
import { Task } from 'app/models/task';
import { InsertTaskData } from '../models/insert.task.data';
import { KanbanColumnStore } from './kanban.column.store';
import { IOrderableStore } from './orderable.store';
import { StoreOrderController } from '../order/order.controller';
import { InsertProjectResult } from '../models/insert.project.result';

export class ProjectStore implements IOrderableStore<Project> {
  private projectRepository: IProjectRepository;
  private taskStore: TaskStore;
  private stageStore: StageStore;
  private kanbanColumnStore: KanbanColumnStore;
  private orderController: StoreOrderController<Project>;

  constructor(
    projectRepository: IProjectRepository,
    taskStore: TaskStore,
    stageStore: StageStore,
    kanbanColumnStore: KanbanColumnStore
  ) {
    this.projectRepository = projectRepository;
    this.taskStore = taskStore;
    this.stageStore = stageStore;
    this.kanbanColumnStore = kanbanColumnStore;
    this.orderController = new StoreOrderController(projectRepository);
  }

  public createProject(project: Project): Promise<InsertProjectResult> {
    return this.projectRepository.insertProject(project).then((insertedId) => {
      return this.createKanbanColumn(insertedId).then((column) => {
        return this.getProjectById(insertedId).then((project) => {
          return this.orderController
            .insert(project, null, null)
            .then((updatedProjects) => {
              const result = new InsertProjectResult();
              result.insertedProject = project;
              result.updatedProjects = updatedProjects;
              result.insertedKanbanColumn = column;
              return Promise.resolve(result);
            });
        });
      });
    });
  }

  private createKanbanColumn(insertedId: number) {
    const column = new KanbanColumn();
    // column.setName("-X-DEFAULT-X-");
    column.setDefault(true);
    column.setProjectId(insertedId);
    return this.kanbanColumnStore.create(column);
  }

  public updateProject(project: Project): Promise<Project> {
    return this.projectRepository.update(project).then((result) => {
      return Promise.resolve(project);
    });
  }

  public removeProject(projectId: number): Promise<Project[]> {
    const promises = [
      this.taskStore.removeTasksByProject(projectId),
      this.kanbanColumnStore.removeByProject(projectId),
      this.stageStore.removeStagesFromProject(projectId)
    ];
    return Promise.all(promises).then(()=>{
      return this.projectRepository.findById(projectId).then(project=>{
        return this.projectRepository.removeProject(projectId).then(()=>{
          return this.orderController.remove(project);
        });
      })
    });
    // return this.taskStore.getTasksByProject(projectId).then(tasks=>{
    //     let promises = [];
    //     tasks.forEach(task=>{
    //         let promise = this.taskStore.removeTask(task.getId());
    //         promises.push(promise);
    //     });
    //     promises.push(this.stageStore.removeStagesFromProject(projectId));
    //     return Promise.all(promises);
    // }).then(()=>{
    //     return this.projectRepository.removeProject(projectId);
    // });
  }

  private removeAllTaskFromProject(projectId: number): Promise<void | any> {
    return this.taskStore.getTasksByProject(projectId).then((tasks) => {
      let promises = [];
      tasks.forEach((task) => {
        let promise = this.taskStore.removeTask(task.getId());
        promises.push(promise);
      });
      return Promise.all(promises);
    });
  }

  public getProjectById(id: number): Promise<Project> {
    return this.projectRepository.findById(id).then((project) => {
      if (project) {
        return this.fillProject(project);
      } else {
        return Promise.resolve(null);
      }
    });
  }

  private fillProject(project: Project): Promise<Project> {
    return this.taskStore.getTasksByProject(project.getId()).then((tasks) => {
      project.setTasks(tasks);
      return this.stageStore
        .getStagesByProject(project.getId())
        .then((stages) => {
          project.setStages(stages);
          return Promise.resolve(project);
        });
    });
  }

  public getProjectsByName(name: string): Promise<Project[]> {
    return this.projectRepository.findProjectsByName(name);
  }

  public getAllProjects(): Promise<Project[]> {
    return this.projectRepository.findAllProjects();
  }

  public move(
    previousItem: Project,
    currentItem: Project,
    moveUp: boolean
  ): Promise<Project[]> {
    return this.orderController.move(previousItem, currentItem, moveUp);
  }

  public changeContainer(
    item: any,
    currentTask: Project,
    currentContainerId: number
  ): Promise<Project[]> {
    return this.orderController.changeContainer(
      item,
      currentTask,
      currentContainerId
    );
  }
}
