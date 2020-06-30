import { ITaskRepository } from '../repositories/task_repository';
import { Task } from 'app/models/task';
import { SubtaskStore } from './subtask_store';
import { TagStore } from './tag_store';

// TODO: przydałyby się do tego wszystkiego transakcje. 
export class TaskStore{

    private taskRepository: ITaskRepository;
    private subtaskStore: SubtaskStore;
    private tagStore: TagStore;

    constructor(taskRepository: ITaskRepository, subtaskStore: SubtaskStore, tagStore:TagStore){
        this.taskRepository = taskRepository;
        this.subtaskStore = subtaskStore;
        this.tagStore = tagStore;
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
        return this.subtaskStore.getSubtaskByTask(task.getId()).then(subtasks => {
            task.setSubtasks(subtasks);
        }).then(() => {
            return this.tagStore.getTagsByTask(task.getId()).then(tags => {
                tags.forEach(tag => {
                    task.addTag(tag);
                });
            }).then(() => {
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
            return this.getTaskById(insertedId);
        });
    }

    public updateTask(task:Task):Promise<Task>{
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
