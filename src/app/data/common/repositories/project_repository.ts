import { Project } from 'app/models/project';

export interface IProjectRepository{
    findAllProjects(): Promise<Project[]>;
    findProjectById(id: number):Promise<Project>;
    findProjectsByName(name:string): Promise<Project[]>;
    findProjectsByDescription(description: string): Promise<Project[]>;
    findProjectsByDeadlineDate(date:Date):Promise<Project[]>;
    insertProject(project:Project): Promise<number>;
    updateProject(project:Project):Promise<number>;
    removeProject(id: number):Promise<void>;
}