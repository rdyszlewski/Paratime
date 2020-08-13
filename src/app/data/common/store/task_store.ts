import { ITaskRepository } from '../repositories/task_repository';
import { Task } from 'app/models/task';
import { SubtaskStore } from './subtask_store';
import { LabelStore } from './label_store';
import { IProjectRepository } from '../repositories/project_repository';
import { StageStore } from './stage_store';
import { Subtask } from 'app/models/subtask';
import { LabelsTask } from '../models';
import { InsertTaskData } from '../models/insert.task.data';
import { InsertTaskResult } from '../models/insert.task.result';
import { InsertKanbanTaskResult } from '../models/insert.kanban.task.result';
import { Status } from 'app/models/status';
import { IOrderableStore } from './orderable.store';
import { StoreOrderController } from '../order/order.controller';
import { KanbanTaskStore } from './kanban.task.store';

// TODO: przydałyby się do tego wszystkiego transakcje.
export class TaskStore implements IOrderableStore<Task> {
  private taskRepository: ITaskRepository;
  private subtaskStore: SubtaskStore;
  private labelStore: LabelStore;
  private projectRepository: IProjectRepository;
  private stageStore: StageStore;
  private kanbanTaskStore: KanbanTaskStore;

  private orderController: StoreOrderController<Task>;

  constructor(
    taskRepository: ITaskRepository,
    subtaskStore: SubtaskStore,
    labelStore: LabelStore,
    projectRepository: IProjectRepository,
    stageStore: StageStore,
    kanbanTaskStore: KanbanTaskStore
  ) {
    this.taskRepository = taskRepository;
    this.subtaskStore = subtaskStore;
    this.labelStore = labelStore;
    // TODO: przemyśleć, czy na pewno tak to powinno wyglądać
    this.projectRepository = projectRepository;
    this.stageStore = stageStore;
    this.kanbanTaskStore = kanbanTaskStore;

    this.orderController = new StoreOrderController(taskRepository);
  }

  public getById(id: number): Promise<Task> {
    return this.taskRepository.findById(id).then((task) => {
      if (task) {
        return this.setTaskData(task);
      }
      return Promise.resolve(task);
    });
  }

  private setTaskData(task: Task): Task | PromiseLike<Task> {
    // TODO: przydałaby się refaktoryzacja
    // TODO: być może będzie trzeba załadować etap
    return this.subtaskStore
      .getSubtaskByTask(task.getId())
      .then((subtasks) => {
        task.setSubtasks(subtasks);
      })
      .then(() => {
        return this.labelStore
          .getLabelsByTask(task.getId())
          .then((labels) => {
            labels.forEach((label) => {
              task.addLabel(label);
            });
          })
          .then(() => {
            // TODO: być może to będzie do wyrzucenia
            if (task.getProjectStageID()) {
              return this.stageStore
                .getStageById(task.getProjectStageID())
                .then((stage) => {
                  task.setProjectStage(stage);
                });
            }
          })
          .then(() => {
            // TODO: zrobić pobieranie projektu. Chyba nie przyniosło to oczekiwanego rezultatu
            if (task.getProjectID() != null) {
              return this.projectRepository
                .findById(task.getProjectID())
                .then((project) => {
                  task.setProject(project);
                  // TODO: w tym miejscu można ustawić odpowiedni etap, pobierając go z projektu
                  return Promise.resolve(task);
                });
            }

            return Promise.resolve(task);
          });
      });
  }

  public getTasksByName(name: string): Promise<Task[]> {
    return this.taskRepository.findTasksByName(name).then((tasks) => {
      return this.getCompletedTasks(tasks);
    });
  }

  private getCompletedTasks(tasks: Task[]) {
    let promises = [];
    tasks.forEach((task) => {
      let completedTask = this.setTaskData(task);
      promises.push(completedTask);
    });
    return Promise.all(promises);
  }

  public getTasksByProject(projectId: number): Promise<Task[]> {
    return this.taskRepository.findTasksByProject(projectId).then((tasks) => {
      return this.getCompletedTasks(tasks);
    });
  }

  public getActiveTasks(projectId: number): Promise<Task[]> {
    return this.taskRepository
      .findTasksExceptStatus(projectId, Status.ENDED)
      .then((tasks) => {
        const promises = tasks.map((task) => this.setTaskData(task));
        return Promise.all(promises);
      });
  }

  public getFinishedTasks(projectId: number): Promise<Task[]> {
    // TODO: zastanowić się, czy anulowane zadania nalęzy zaliczać do aktywnych
    return this.taskRepository
      .findTasksByStatus(projectId, Status.ENDED)
      .then((tasks) => {
        const promises = tasks.map((task) => this.setTaskData(task));
        return Promise.all(promises);
      });
  }

  public getTasksByDate(date: Date): Promise<Task[]> {
    return this.taskRepository.findTasksByDate(date).then((tasks) => {
      return this.getCompletedTasks(tasks);
    });
  }

  public getImportantTasks(): Promise<Task[]> {
    return this.taskRepository.findImportantTasks().then((tasks) => {
      return this.getCompletedTasks(tasks);
    });
  }

  // TODO: to nie powinno być publiczne. Wymyślić jakiś sposób, aby to zmienić
  public insert(
    task: Task,
    beforeTask: Task,
    currentContainerId: number
  ): Promise<Task[]> {
    return this.orderController.insert(task, beforeTask, currentContainerId);
  }

  public createTask(data: InsertTaskData): Promise<InsertTaskResult> {
    return this.insertTask(data.task).then((insertedTask) => {
      return this.insertTaskProperties(data, insertedTask);
    });
  }

  private insertTaskProperties(
    data: InsertTaskData,
    insertedTask: Task
  ): Promise<InsertTaskResult> {
    const result = new InsertTaskResult();
    result.insertedTask = insertedTask;
    data.task = insertedTask; // TODO: wyjście tymczasowe
    const promises = [
      // TODO: sprawdzić, czy data.task ma sens. Prawdopodobnie nie ma
      this.insertSubtasks(data.task, insertedTask.getId()),
      this.insertTasksLabels(data.task, insertedTask.getId()),
      this.createKanbanTask(data).then((kanbanTaskResult) => {
        result.insertedKanbanTask = kanbanTaskResult.insertedKanbanTask;
        result.updatedKanbanTasks = kanbanTaskResult.updatedKanbanTask;
        return Promise.resolve(null);
      }),
      this.insert(insertedTask, null, insertedTask.getContainerId()).then(
        (updatedTasks) => {
          result.updatedTasks = updatedTasks;
          return Promise.resolve(null);
        }
      ),
    ];

    return Promise.all(promises).then(() => {
      return Promise.resolve(result);
    });
  }

  private insertTask(task: Task) {
    // TODO: tutaj chyba powinno być wstawianie kanbanów
    return this.taskRepository.insertTask(task).then((insertedId) => {
      return this.taskRepository.findById(insertedId);
    });
  }

  private insertSubtasks(task: Task, insertedId: number) {
    const promises: Promise<Subtask>[] = [];
    task.getSubtasks().forEach((subtask) => {
      subtask.setTaskId(insertedId);
      let subtaskPromise = this.subtaskStore
        .createSubtask(subtask)
        .then((result) => {
          return Promise.resolve(result.insertedSubtask);
        });
      promises.push(subtaskPromise);
    });
    return promises;
  }

  private insertTasksLabels(task: Task, insertedId: number) {
    const promises: Promise<LabelsTask>[] = [];
    task.getLabels().forEach((label) => {
      let labelPromise = this.labelStore.connectTaskAndLabel(
        insertedId,
        label.getId()
      );
      promises.push(labelPromise);
    });
    return promises;
  }

  private createKanbanTask(
    data: InsertTaskData
  ): Promise<InsertKanbanTaskResult> {
    return this.kanbanTaskStore.create(data);
  }

  public update(task: Task): Promise<Task> {
    return this.taskRepository.update(task).then((result) => {
      return Promise.resolve(task);
    });
  }

  public removeTask(taskId: number): Promise<Task[]> {
    return this.taskRepository.findById(taskId).then((task) => {
      let updatedItems = [];
      const promises = [
        this.subtaskStore.removeSubtaskFromTask(taskId),
        this.labelStore.removeTaskLabels(taskId),
        this.kanbanTaskStore.removeTask(taskId),
        this.remove(task).then((tasks) => {
          updatedItems = tasks;
          return Promise.resolve(null);
        }),
      ];

      return Promise.all(promises).then(() => {
        return this.taskRepository.removeTask(taskId).then(() => {
          return Promise.resolve(updatedItems);
        });
      });
    });
  }

  // TODO: to nie powinno być publiczne. Znaleźć jakiś spsoób, żeby to zmienić
  public remove(task: Task): Promise<Task[]> {
    return this.orderController.remove(task);
  }

  public removeTasksByProject(projectId: number) {
    return this.taskRepository.removeTasksByProject(projectId);
  }

  public changeStatus(task: Task, status: Status): Promise<Task[]> {
    let updated = new Set<Task>();
    task.setStatus(status);
    updated.add(task);
    return this.orderController.remove(task).then((updatedItems) => {
      updatedItems.forEach((x) => updated.add(x));
      return this.taskRepository
        .findFirstTaskWithStatus(task.getProjectID(), status)
        .then((firstTask) => {
          return this.orderController
            .insert(task, firstTask, task.getContainerId())
            .then((updatedItems) => {
              updatedItems.forEach((x) => updated.add(x));
              return Promise.resolve(Array.from(updated));
            });
        });
    });
  }

  public move(
    previousItem: Task,
    currentItem: Task,
    moveUp: boolean
  ): Promise<Task[]> {
    return this.orderController.move(previousItem, currentItem, moveUp);
  }

  public changeContainer(
    item: any,
    currentTask: Task,
    currentContainerId: number
  ): Promise<Task[]> {
    return this.orderController.changeContainer(
      item,
      currentTask,
      currentContainerId
    );
  }
}
