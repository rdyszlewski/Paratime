import { ITaskRepository } from '../repositories/task_repository';
import { Task } from 'app/models/task';
import { SubtaskStore } from './subtask_store';
import { LabelStore } from './label_store';
import { IProjectRepository } from '../repositories/project_repository';
import { StageStore } from './stage_store';
import { KanbanStore } from './kanban_store';
import { KanbanTask } from 'app/models/kanban';
import { Subtask } from 'app/models/subtask';
import { promise } from 'protractor';
import { TaskLabelsModel } from 'app/task-details/labels/task.label.model';
import { LabelsTask } from '../models';
import { InsertTaskData } from '../models/insert.task.data';
import { InsertTaskResult } from '../models/insert.task.result';
import { DataService } from 'app/data.service';
import { InsertKanbanTaskResult } from '../models/insert.kanban.task.result';
import { resolve } from 'dns';


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
        // TODO: spróbować to jakoś czytelniej napisać
        const result = new InsertTaskResult();
        const task = data.task;
        console.log(data.projectId);
        return this.taskRepository.findLastTask(data.projectId).then(lastTask=>{
            console.log("Jestem tutaj i jestem z tego dumny");
            const lastTaskId = lastTask != null ? lastTask.getId() : -1;
            task.setPrevId(lastTaskId);
            task.setNextId(-1);
            console.log(2);
            console.log(task);
            return this.insertTask(task).then(insertedTask=>{
                const insertedId = insertedTask.getId();
                result.insertedTask = insertedTask;
                console.log("Wstawiono to");
                console.log(insertedTask);
                console.log(3);
                const promises = [];
                // TODO: sprawdzić, czy to index jest ok
                promises.concat(this.insertSubtasks(task, insertedId));
                promises.concat(this.insertTasksLabels(task, insertedId));
                this.createKanbanTask(data).then(kanbanTaskResult=>{
                    result.insertedKanbanTask = kanbanTaskResult.insertedKanbanTask;
                    result.updatedKanbanTasks = kanbanTaskResult.updatedKanbanTask;
                    console.log("Zaraz będę wykonywał dodawanie zadania");
                    promises.push(Promise.resolve(null));
                });
                console.log(4);
                if(lastTask){
                    lastTask.setNextId(insertedId);
                    promises.push(this.updateTask(lastTask));
                    result.updatedTasks.push(lastTask);
                    console.log(5);
                }
                // TODO: przetestować, czy wykonanie ostaniego zdania
                console.log("Wykonanie promise all");
                return Promise.all(promises).then(()=>{
                  console.log("Zwracanie wyniku");
                  return Promise.resolve(result);
                });
                // TODO: wstawianie podzadań
            })
        });
    }

    private insertTask(task:Task){
      return this.taskRepository.insertTask(task).then(insertedId=>{
        return this.taskRepository.findTaskById(insertedId);
      });
    }

    // public createTask(task:Task):Promise<Task>{
    //     return this.taskRepository.insertTask(task).then(insertedId=>{
    //         const promises = [];
    //         promises.concat(this.insertSubtasks(task, insertedId));
    //         promises.concat(this.insertTasksLabels(task, insertedId));


    //         return Promise.all(promises).then(()=>{
    //             return this.getTaskById(insertedId);
    //         });
    //     });
    // }

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
        return this.subtaskStore.removeSubtaskFromTask(taskId).then(()=>{
            return this.labelStore.removeTaskLabels(taskId).then(()=>{
                return this.taskRepository.removeTask(taskId);
            });
        });
    }

}
