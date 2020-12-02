import { Project } from '../data/models/project';
import { Task } from '../data/models/task';
import { ProjectFilter } from '../filter/project.filter';
import { ProjectInsertResult } from '../model/project.insert-result';

export interface IProjectService{
  getById(id: number): Promise<Project>;
  getByName(name: string): Promise<Project[]>;
  getByFilter(filter: ProjectFilter): Promise<Project[]>;
  getAll(): Promise<Project[]>;
  create(project: Project): Promise<ProjectInsertResult>;
  /// return: project in which the order has changed
  remove(id: number): Promise<Project[]>;
  update(project: Project): Promise<Project>;
  changeOrder(currentProject: Project, previousProject: Project, currentIndex: number, previousIndex: number): Promise<Project[]>;
}
