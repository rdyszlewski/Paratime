import { IProjectRepository } from '../common/project_repository';
import { Project } from 'app/models/project';
import { LocalDatabase } from './database';

export class LocalProjectRepository implements IProjectRepository{

    private database: LocalDatabase;

    constructor(database:LocalDatabase){
        this.database = database;
    }

    public findProjectById(id: number): Project {
        throw new Error("Method not implemented.");
    }

    public findProjectsByName(name: string): Project[] {
        throw new Error("Method not implemented.");
    }

    public findProjectsByDescription(description: string): Project[] {
        throw new Error("Method not implemented.");
    }

    public findProjectsByDeadlineDate(date: Date): Project[] {
        throw new Error("Method not implemented.");
    }

    public insertProject(project: Project): Project {
        throw new Error("Method not implemented.");
    }

    public updateProject(project: Project): Project {
        throw new Error("Method not implemented.");
    }

    public removeProject(id: number): void {
        throw new Error("Method not implemented.");
    }

}