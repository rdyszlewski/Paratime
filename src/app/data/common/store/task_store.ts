import { ITaskRepository } from '../repositories/task_repository';
import { Task } from 'app/models/task';
import { SubtaskStore } from './subtask_store';
import { LabelStore } from './label_store';
import { IProjectRepository } from '../repositories/project_repository';
import { IProjectStageRepository } from '../repositories/stage_repository';
import { StageStore } from './stage_store';


// TODO: przydałyby się do tego wszystkiego transakcje. 
export class TaskStore{

    private taskRepository: ITaskRepository;
    private subtaskStore: SubtaskStore;
    private labelStore: LabelStore;
    private projectRepository: IProjectRepository;
    private stageStore: StageStore;

    constructor(taskRepository: ITaskRepository, subtaskStore: SubtaskStore, labelStore:LabelStore, projectRepository:IProjectRepository, stageStore:StageStore){
        this.taskRepository = taskRepository;
        this.subtaskStore = subtaskStore;
        this.labelStore = labelStore;
        // TODO: przemyśleć, czy na pewno tak to powinno wyglądać
        this.projectRepository = projectRepository;
        this.stageStore = stageStore;
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

    public createTask(task:Task):Promise<Task>{
        return this.taskRepository.insertTask(task).then(insertedId=>{
            // TODO: wstawienie podzadań
            // TODO; wstawienie etykiet
            const promises = [];
            task.getSubtasks().forEach(subtask=>{
                subtask.setTaskId(insertedId);
                let subtaskPromise = this.subtaskStore.createSubtask(subtask).then(subtask=>{
                    return Promise.resolve(subtask);
                });
                promises.push(subtaskPromise);
            });
            task.getLabels().forEach(label=>{
                let labelPromise = this.labelStore.connectTaskAndLabel(insertedId, label.getId());
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
            return this.labelStore.removeTaskLabels(taskId).then(()=>{
                return this.taskRepository.removeTask(taskId);
            });
        });
    }
    
}
