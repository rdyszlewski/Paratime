import { Project } from 'app/models/project';
import { IProjectRepository } from '../repositories/project_repository';
import { TaskStore } from './task_store';
import { StageStore } from './stage_store';
import { promise } from 'protractor';
import { KanbanStore } from './kanban_store';
import { KanbanColumn } from 'app/models/kanban';

export class ProjectStore{

    private projectRepository: IProjectRepository;
    private taskStore: TaskStore;
    private stageStore: StageStore;
    private kanbanStore: KanbanStore;
    
    constructor(projectRepository: IProjectRepository, taskStore: TaskStore, stageStore: StageStore, kanbanStore: KanbanStore){
        this.projectRepository = projectRepository;
        this.taskStore = taskStore;
        this.stageStore = stageStore;
        this.kanbanStore = kanbanStore;
    }

    // TODO: postarać się, żeby potrzebne elementy były wstrzykiwane

    public createProject(project:Project): Promise<Project>{
        return this.projectRepository.insertProject(project).then(insertedId=>{
            const column = new KanbanColumn();
            column.setDefault(true);
            column.setProjectId(insertedId);
            return this.kanbanStore.createColumn(column).then(()=>{
                return this.getProjectById(insertedId);
            })
        });
    }

    public updateProject(project:Project):Promise<Project>{
        return this.projectRepository.updateProject(project).then(result=>{
            return Promise.resolve(project);
        });
    }

    public removeProject(projectId: number): Promise<void>{
        return this.taskStore.getTasksByProject(projectId).then(tasks=>{
            let promises = [];
            tasks.forEach(task=>{
                let promise = this.taskStore.removeTask(task.getId());
                promises.push(promise);
            });
            promises.push(this.stageStore.removeStagesFromProject(projectId));
            return Promise.all(promises);
            
        }).then(()=>{
            return this.projectRepository.removeProject(projectId);
        });
    }

    private removeAllTaskFromProject(projectId: number):Promise<void|any>{
        return this.taskStore.getTasksByProject(projectId).then(tasks=>{
            let promises = [];
            tasks.forEach(task=>{
                let promise = this.taskStore.removeTask(task.getId());
                promises.push(promise);
            });
            return Promise.all(promises);
        });
    }

    public getProjectById(id: number): Promise<Project>{
        return this.projectRepository.findProjectById(id).then(project=>{
            if(project){
                return this.fillProject(project);
            } else {
                return Promise.resolve(null);
            }
        });
    }

    private fillProject(project:Project):Promise<Project>{
        return this.taskStore.getTasksByProject(project.getId()).then(tasks=>{
            project.setTasks(tasks);
            return this.stageStore.getStagesByProject(project.getId()).then(stages=>{
                project.setStages(stages);
                return Promise.resolve(project);
            });
        });
    }

    public getProjectsByName(name:string): Promise<Project[]>{
        return this.projectRepository.findProjectsByName(name);
    }

    public getAllProjects():Promise<Project[]>{
        return this.projectRepository.findAllProjects();
    }
}