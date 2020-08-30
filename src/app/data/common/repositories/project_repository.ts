import { Project } from 'app/data/models/project';
import { IOrderableRepository } from './orderable.repository';

export interface IProjectRepository extends IOrderableRepository<Project>{
    findAllProjects(): Promise<Project[]>;
    findById(id: number):Promise<Project>;
    findProjectsByName(name:string): Promise<Project[]>;
    findProjectsByDescription(description: string): Promise<Project[]>;
    findProjectsByDeadlineDate(date:Date):Promise<Project[]>;
    insertProject(project:Project): Promise<number>;
    update(project:Project):Promise<number>;
    removeProject(id: number):Promise<void>;
}
