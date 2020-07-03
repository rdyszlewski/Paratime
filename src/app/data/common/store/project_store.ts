import { Project } from 'app/models/project';
import { IProjectRepository } from '../repositories/project_repository';
import { TaskStore } from './task_store';

export class ProjectStore{

    private projectRepository: IProjectRepository;
    private taskStore: TaskStore;
    
    constructor(projectRepository: IProjectRepository, taskStore: TaskStore){
        this.projectRepository = projectRepository;
        this.taskStore = taskStore;
    }

    // TODO: postarać się, żeby potrzebne elementy były wstrzykiwane

    public createProject(project:Project): Promise<Project>{
        return this.projectRepository.insertProject(project).then(insertedId=>{
            return this.getProjectById(insertedId);
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
            return Promise.all(promises);
            
        }).then(()=>{
            return this.projectRepository.removeProject(projectId);
        });
    }

    private removeAllTaskFromProject(projectId: number):Promise<void>{
        return this.taskStore.getTasksByProject(projectId).then()
    }

    public getProjectById(id: number): Promise<Project>{
        return this.projectRepository.findProjectById(id).then(project=>{
            return this.taskStore.getTasksByProject(project.getId()).then(tasks=>{
                project.setTasks(tasks);
                return Promise.resolve(project);
            });
        });
    }

    public getProjectsByName(name:string): Promise<Project[]>{
        return this.projectRepository.findProjectsByName(name);
        // TODO: dodać 
    }

    public getAllProjects():Promise<Project[]>{
        return this.projectRepository.findAllProjects();
    }
}