import { IProjectService } from 'app/database/common/project.service';
import { Project } from 'app/database/data/models/project';
import { Task } from 'app/database/data/models/task';
import { ProjectFilter } from 'app/database/filter/project.filter';
import { ProjectInsertResult } from 'app/database/model/project.insert-result';

export class LocalProjectService implements IProjectService{

  getById(id: number): Promise<Project> {
    throw new Error('Method not implemented.');
  }

  getByName(name: string): Promise<Project[]> {
    throw new Error('Method not implemented.');
  }

  getByFilter(filter: ProjectFilter): Promise<Project[]> {
    throw new Error('Method not implemented.');
  }

  getAll(): Promise<Project[]> {
    throw new Error('Method not implemented.');
  }

  create(project: Project): Promise<ProjectInsertResult> {
    throw new Error('Method not implemented.');
  }

  remove(id: number): Promise<Project> {
    throw new Error('Method not implemented.');
  }

  update(project: Project): Promise<Project> {
    throw new Error('Method not implemented.');
  }

  changeOrder(currentTask: Task, previoustask: Task, currentIndex: number, previousIndex: number): Promise<Project[]> {
    throw new Error('Method not implemented.');
  }

}
