import { Project } from 'app/models/project';
import { PromiseExtended } from 'dexie';

export interface IProjectRepository{
    findProjectById(id: number):Promise<Project>;
    findProjectsByName(name:string): Promise<Project[]>;
    findProjectsByDescription(description: string): Promise<Project[]>;
    findProjectsByDeadlineDate(date:Date):Promise<Project[]>;
    insertProject(project:Project): Promise<Project>;
    updateProject(project:Project):Promise<Project>;
    removeProject(id: number):Promise<void>;
}