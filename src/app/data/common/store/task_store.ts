import { ITaskRepository } from '../repositories/task_repository';
import { Task } from 'app/models/task';
import { SubtaskStore } from './subtask_store';
import { TagStore } from './tag_store';
import { IProjectRepository } from '../repositories/project_repository';
import { TaskTagsModel } from '../models';
import { promise } from 'protractor';

// TODO: przydałyby się do tego wszystkiego transakcje. 
export class TaskStore{

    private taskRepository: ITaskRepository;
    private subtaskStore: SubtaskStore;
    private tagStore: TagStore;
    private projectRepository: IProjectRepository;

    constructor(taskRepository: ITaskRepository, subtaskStore: SubtaskStore, tagStore:TagStore, projectRepository:IProjectRepository){
        this.taskRepository = taskRepository;
        this.subtaskStore = subtaskStore;
        this.tagStore = tagStore;
        // TODO: przemyśleć, czy na pewno tak to powinno wyglądać
        this.projectRepository = projectRepository;
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
        return this.subtaskStore.getSubtaskByTask(task.getId()).then(subtasks => {
            console.log("Pobieranie zadania");
            console.log(subtasks);
            task.setSubtasks(subtasks);
        }).then(() => {
            return this.tagStore.getTagsByTask(task.getId()).then(tags => {
                tags.forEach(tag => {
                    task.addTag(tag);
                });
            }).then(() => {
                // TODO: zrobić pobieranie projektu. Chyba nie przyniosło to oczekiwanego rezultatu
                if(task.getProjectID()!=null){
                    return this.projectRepository.findProjectById(task.getProjectID()).then(project=>{
                        task.setProject(project);
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

    public createTask(task:Task):Promise<Task>{
        return this.taskRepository.insertTask(task).then(insertedId=>{
            // TODO: wstawienie podzadań
            // TODO; wstawienie etykiet
            const promises = [];
            task.getSubtasks().forEach(subtask=>{
                console.log("Wstawiam zadanie");
                subtask.setTaskId(insertedId);
                let subtaskPromise = this.subtaskStore.createSubtask(subtask).then(subtask=>{
                    console.log("Wstawione podzadanie");
                    console.log(subtask);
                    return Promise.resolve(subtask);
                });
                promises.push(subtaskPromise);
            });
            task.getTags().forEach(label=>{
                console.log("Wstawiam etykietę");
                const entry = new TaskTagsModel(insertedId, label.getId());
                let labelPromise = this.tagStore.connectTaskAndTag(entry);
                promises.push(labelPromise);
            });
            return Promise.all(promises).then(()=>{
                return this.getTaskById(insertedId);
            });
        });
    }

    public updateTask(task:Task):Promise<Task>{
        // TODO: tutaj chyba nie trzeba aktualizować tego oddzielnie
        return this.taskRepository.updateTask(task).then(result=>{
            return Promise.resolve(task);
        });
    }

    public removeTask(taskId:number):Promise<void>{
        return this.subtaskStore.removeSubtaskFromTask(taskId).then(()=>{
            return this.tagStore.removeTaskTags(taskId).then(()=>{
                return this.taskRepository.removeTask(taskId);
            });
        });
    }
    
}
