import { ITaskRepository } from '../repositories/task_repository';
import { Task } from 'app/models/task';
import { SubtaskStore } from './subtask_store';
import { LabelStore } from './label_store';
import { IProjectRepository } from '../repositories/project_repository';
import { StageStore } from './stage_store';
import { KanbanStore } from './kanban_store';
import { Subtask } from 'app/models/subtask';
import { LabelsTask } from '../models';
import { InsertTaskData } from '../models/insert.task.data';
import { InsertTaskResult } from '../models/insert.task.result';
import { InsertKanbanTaskResult } from '../models/insert.kanban.task.result';
import { Position } from 'app/models/orderable.item';
import { Status } from 'app/models/status';
import { OrderValues } from 'app/common/valuse';


// TODO: przydałyby się do tego wszystkiego transakcje.
export class TaskStore{

    private taskRepository: ITaskRepository;
    private subtaskStore: SubtaskStore;
    private labelStore: LabelStore;
    private projectRepository: IProjectRepository;
    private stageStore: StageStore;
    private kanbanStore: KanbanStore;

    constructor(taskRepository: ITaskRepository, subtaskStore: SubtaskStore, labelStore:LabelStore, projectRepository:IProjectRepository, stageStore:StageStore,
        kanbanStore: KanbanStore){
        this.taskRepository = taskRepository;
        this.subtaskStore = subtaskStore;
        this.labelStore = labelStore;
        // TODO: przemyśleć, czy na pewno tak to powinno wyglądać
        this.projectRepository = projectRepository;
        this.stageStore = stageStore;
        this.kanbanStore = kanbanStore;
    }

    public getTaskById(id:number):Promise<Task>{
        return this.taskRepository.findTaskById(id).then(task=>{
            if(task){
                return this.setTaskData(task);
            }
            return Promise.resolve(task);
        });
    }

    private setTaskData(task: Task): Task | PromiseLike<Task> {
        // TODO: przydałaby się refaktoryzacja
        // TODO: być może będzie trzeba załadować etap
        return this.subtaskStore.getSubtaskByTask(task.getId()).then(subtasks => {
            task.setSubtasks(subtasks);
        }).then(() => {
            return this.labelStore.getLabelsByTask(task.getId()).then(labels => {
                labels.forEach(label => {
                    task.addLabel(label);
                });
            }).then(()=>{
                // TODO: być może to będzie do wyrzucenia
                if(task.getProjectStageID()){
                    return this.stageStore.getStageById(task.getProjectStageID()).then(stage=>{
                        task.setProjectStage(stage);
                    });
                    }
            }).then(() => {
                // TODO: zrobić pobieranie projektu. Chyba nie przyniosło to oczekiwanego rezultatu
                if(task.getProjectID()!=null){
                    return this.projectRepository.findProjectById(task.getProjectID()).then(project=>{
                        task.setProject(project);
                        // TODO: w tym miejscu można ustawić odpowiedni etap, pobierając go z projektu
                        return Promise.resolve(task);
                    })
                }

                return Promise.resolve(task);
            });
        });
    }

    public getTasksByName(name:string): Promise<Task[]>{
        return this.taskRepository.findTasksByName(name).then(tasks=>{
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

    public getTasksByProject(projectId:number):Promise<Task[]>{
        return this.taskRepository.findTasksByProject(projectId).then(tasks=>{
            return this.getCompletedTasks(tasks);
        });
    }

    public getActiveTasks(projectId: number):Promise<Task[]>{
      return this.taskRepository.findTasksExceptStatus(projectId,Status.ENDED);
    }

    public getFinishedTasks(projectId: number): Promise<Task[]>{
      // TODO: zastanowić się, czy anulowane zadania nalęzy zaliczać do aktywnych
      return this.taskRepository.findTasksByStatus(projectId, Status.ENDED);
    }

    public getTasksByDate(date:Date):Promise<Task[]>{
        return this.taskRepository.findTasksByDate(date).then(tasks=>{
            return this.getCompletedTasks(tasks);
        });
    }

    public getImportantTasks(): Promise<Task[]>{
        return this.taskRepository.findImportantTasks().then(tasks=>{
            return this.getCompletedTasks(tasks);
        });
    }

    public createTask(data: InsertTaskData): Promise<InsertTaskResult>{
        // TODO: to odnosi się do wstawiania na koniec
        // TODO: spróbować to jakoś czytelniej napisać
        const result = new InsertTaskResult();
        const task = data.task;
        return this.taskRepository.findLastTask(data.projectId).then(lastTask=>{
          task.setSuccessorId(-1);
          return this.taskRepository.findFirstTask(data.projectId).then(firstTask=>{
            if(!firstTask){
              // TODO: to też przenieść do klasy, która zarządza kolejnościa
              task.setPosition(Position.HEAD);
            }
            return this.insertTask(task).then(insertedTask=>{
              const insertedId = insertedTask.getId();
              result.insertedTask = insertedTask;
              const promises = [];
              // TODO: sprawdzić, czy to index jest ok
              promises.concat(this.insertSubtasks(task, insertedId));
              promises.concat(this.insertTasksLabels(task, insertedId));
              data.task = insertedTask; // TODO: sprawdzić, czy działa, ewentualnie zmienić miejsce
              this.createKanbanTask(data).then(kanbanTaskResult=>{
                  result.insertedKanbanTask = kanbanTaskResult.insertedKanbanTask;
                  result.updatedKanbanTasks = kanbanTaskResult.updatedKanbanTask;
                  promises.push(Promise.resolve(null));
              });
              if(lastTask){
                  // TODO: przenieść to do jakieś specjalnej metody, która zarządza kolejnością
                  lastTask.setSuccessorId(insertedId);
                  promises.push(this.updateTask(lastTask));
                  result.updatedTasks.push(lastTask);
              }
              // TODO: przetestować, czy wykonanie ostaniego zdania
              return Promise.all(promises).then(()=>{
                return Promise.resolve(result);
              });
            })
          })
        });
    }

    private insertTask(task:Task){
      // TODO: tutaj chyba powinno być wstawianie kanbanów
      return this.taskRepository.insertTask(task).then(insertedId=>{
        return this.taskRepository.findTaskById(insertedId);
      });
    }

    private insertSubtasks(task: Task, insertedId: number) {
        const promises: Promise<Subtask>[] = [];
        task.getSubtasks().forEach(subtask => {
            subtask.setTaskId(insertedId);
            let subtaskPromise = this.subtaskStore.createSubtask(subtask).then(subtask => {
                return Promise.resolve(subtask);
            });
            promises.push(subtaskPromise);
        });
        return promises;
    }

    private insertTasksLabels(task: Task, insertedId: number) {
        const promises: Promise<LabelsTask>[] = [];
        task.getLabels().forEach(label => {
            let labelPromise = this.labelStore.connectTaskAndLabel(insertedId, label.getId());
            promises.push(labelPromise);
        });
        return promises;
    }

    private createKanbanTask(data: InsertTaskData): Promise<InsertKanbanTaskResult>{
        return this.kanbanStore.createKanbanTask(data);
    }

    public updateTask(task:Task):Promise<Task>{
        // TODO: tutaj chyba nie trzeba aktualizować tego oddzielnie
        return this.taskRepository.updateTask(task).then(result=>{
            return Promise.resolve(task);
        });
    }

    public removeTask(taskId:number):Promise<void>{
      // TODO: w tym miejscu będzie trzeba zrobić ustawianie kolejności. Będzie trzeba utworzyć jakiś wspólny iterfejs, aby nie powtarzać kodu
      const promises = [];
      promises.push(this.subtaskStore.removeSubtaskFromTask(taskId));
      promises.push(this.labelStore.removeTaskLabels(taskId));
      promises.push(this.kanbanStore.removeKanbanTask(taskId)); // TODO: sprawdzić, czy id jest ok
      return Promise.all(promises).then(()=>{
        return this.taskRepository.removeTask(taskId);
      });
    }

    public changeStatus(task:Task, status:Status):Promise<Task[]>{
      const toUpdate = [];
      task.setStatus(status);
      task.setPosition(Position.HEAD);
      task.setSuccessorId(OrderValues.DEFAULT_ORDER);
      return this.taskRepository.findFirstTaskWithStatus(task.getProjectID(), status).then(firstTask=>{
        if(firstTask){
          firstTask.setPosition(Position.NORMAL);
          task.setSuccessorId(firstTask.getId());
          toUpdate.push(firstTask);
        }
      }).then(()=>{
        toUpdate.push(task);

        const promises = [];
        toUpdate.forEach(task=>{
          promises.push(this.updateTask(task));
        })

        return Promise.all(promises);
      });
    }
}
