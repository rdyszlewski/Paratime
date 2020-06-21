import { Project } from 'app/models/project';

export interface IProjectRepository{
    findProjectById(id: number):Project;
    findProjectsByName(name:string): Project[];
    findProjectsByDescription(description: string): Project[];
    findProjectsByDeadlineDate(date:Date):Project[];
    insertProject(project:Project):Project;
    updateProject(project:Project):Project;
    removeProject(id: number):void;
}