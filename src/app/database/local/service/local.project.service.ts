import { IProjectService } from 'app/database/common/project.service';
import { Project } from 'app/database/data/models/project';
import { ProjectFilter } from 'app/database/filter/project.filter';
import { ProjectInsertResult } from 'app/database/model/project.insert-result';
import { LocalProjectRepository } from '../repository/local.project.repository';
import { LocalOrderController } from './local.orderable.service';

export class LocalProjectService implements IProjectService{

  private orderController: LocalOrderController<Project>;

  constructor(private projectRepository: LocalProjectRepository){
    this.orderController = new LocalOrderController(projectRepository);
  }

  getById(id: number): Promise<Project> {
    // TODO: zastanowić się, kiedy projekty mają być fetchowane, a kiedy nie
    return this.projectRepository.findById(id).then(project=>{
      return this.fetchProject(project);
    });
    // TODO: usupełnić etapy, uzupełnić zadania
  }

  private fetchProject(project: Project):Promise<Project>{
    if(!project){
      return Promise.resolve(null);
    }
    // TODO: zadania
    // TODO: etapy

    return Promise.resolve(project);
  }


  getByName(name: string): Promise<Project[]> {
    return this.projectRepository.findByName(name).then(projects=>{
        let promises = projects.map(project=>this.fetchProject(project));
        return Promise.all(promises);
    });
  }

  getByFilter(filter: ProjectFilter): Promise<Project[]> {
    return this.projectRepository.findByFilter(filter).then(projects=>{
      let promises = projects.map(project=>this.fetchProject(project));
      return Promise.all(promises);
    });
  }

  getAll(): Promise<Project[]> {
    // without fetching
    return this.projectRepository.findAll();
  }

  create(project: Project): Promise<ProjectInsertResult> {
    return this.insertNewProject(project).then(insertedProject=>{
      // TODO: wstawienie kolumny kanban
      return this.orderInsertedProject(insertedProject);
    });
  }

  private insertNewProject(project: Project): Promise<Project>{
    return this.projectRepository.insert(project).then(insertedId=>{
      return this.projectRepository.findById(insertedId);
    });
  }

  private orderInsertedProject(project: Project): Promise<ProjectInsertResult>{
    return this.orderController.insert(project, null, null).then(updatedProjects=>{
      let result = new ProjectInsertResult(project);
      result.updatedProjects = updatedProjects;
      // TODO: kolumny
      return Promise.resolve(result);
    });
  }

  remove(id: number): Promise<Project[]> {
    // TODO: dodać transakcje
    // TODO: usuwanie zadań
    // TODO: usuwanie etapów
    // TODO: usuwanie kolumn
    // TODO: usunięcie projektu
    // TODO: ustawienie kolejności

    // TODO: sprawdzić, czy
    return this.orderRemovedProject(id).then(updatedProjects=>{
      return this.projectRepository.remove(id).then(()=>{
        return Promise.resolve(updatedProjects);
      })
    });
  }

  private orderRemovedProject(projectId: number): Promise<Project[]>{
    return this.projectRepository.findById(projectId).then(project=>{
      return this.orderController.remove(project);
    });
  }

  update(project: Project): Promise<Project> {
    return this.projectRepository.update(project).then(_=>{
      return Promise.resolve(project);
    })
  }

  changeOrder(currentTask: Project, previousTask: Project, currentIndex: number, previousIndex: number): Promise<Project[]> {
    return this.orderController.move(currentTask, previousTask, currentIndex, previousIndex);
  }
}
