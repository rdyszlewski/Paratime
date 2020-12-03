import { IKanbanColumnService } from 'app/database/common/kanban-column.service';
import { IProjectService } from 'app/database/common/project.service';
import { KanbanColumn } from 'app/database/data/models/kanban';
import { Project } from 'app/database/data/models/project';
import { ProjectFilter } from 'app/database/filter/project.filter';
import { StageFilter } from 'app/database/filter/stage.filter';
import { InsertResult } from 'app/database/model/insert-result';
import { ProjectInsertResult } from 'app/database/model/project.insert-result';
import { LocalProjectRepository } from '../repository/local.project.repository';
import { LocalProjectStageRepository } from '../repository/local.stage.repository';
import { LocalOrderController } from './local.orderable.service';

export class LocalProjectService implements IProjectService{

  private orderController: LocalOrderController<Project>;

  constructor(private repository: LocalProjectRepository,
    private stageRepository: LocalProjectStageRepository,
    private kanbanColumnService: IKanbanColumnService){
    this.orderController = new LocalOrderController(repository);
  }

  public getById(id: number): Promise<Project> {
    // TODO: zastanowić się, kiedy projekty mają być fetchowane, a kiedy nie
    return this.repository.findById(id).then(project=>{
      return this.fetchProject(project);
    });
    // TODO: usupełnić etapy, uzupełnić zadania
  }

  private fetchProject(project: Project):Promise<Project>{
    if(!project){
      return Promise.resolve(null);
    }
    let stageFiler = StageFilter.getBuilder().setProjectId(project.getId()).build();
    return this.stageRepository.findByFilter(stageFiler).then(stages=>{
      project.setStages(stages);
      return Promise.resolve(project);
    });
  }


  public getByName(name: string): Promise<Project[]> {
    return this.repository.findByName(name).then(projects=>{
        let promises = projects.map(project=>this.fetchProject(project));
        return Promise.all(promises);
    });
  }

  public getByFilter(filter: ProjectFilter): Promise<Project[]> {
    return this.repository.findByFilter(filter).then(projects=>{
      let promises = projects.map(project=>this.fetchProject(project));
      return Promise.all(promises);
    });
  }

  public getAll(): Promise<Project[]> {
    // without fetching
    return this.repository.findAll();
  }

  public create(project: Project): Promise<ProjectInsertResult> {
     return this.insertNewProject(project).then(insertedProject=>{
      return Promise.all([
        this.orderController.insert(insertedProject, null, null),
        this.insertDefaultKanbanColumn(insertedProject.getId())
      ]).then(results=>{
        console.log(results);
        return this.createInsertResult(insertedProject, results[0], results[1]);
      })
    });
  }

  private createInsertResult(insertedProject: Project, updatedProject: Project[], kanbanResult: InsertResult<KanbanColumn>) {
    let result = new ProjectInsertResult(insertedProject);
    result.updatedProjects = updatedProject;
    result.insertedKanbanColumn = kanbanResult.insertedElement;
    result.updatedKanbanColumns = kanbanResult.updatedElements;
    return Promise.resolve(result);
  }

  private insertDefaultKanbanColumn(projectId: number): Promise<InsertResult<KanbanColumn>>{
    let defaultColumn = new KanbanColumn();
    defaultColumn.setProjectId(projectId);
    defaultColumn.setDefault(true);
    return this.kanbanColumnService.create(defaultColumn);
  }

  private insertNewProject(project: Project): Promise<Project>{
    return this.repository.insert(project).then(insertedId=>{
      return this.repository.findById(insertedId);
    });
  }

  public remove(id: number): Promise<Project[]> {
    // TODO: dodać transakcje
    // TODO: usuwanie zadań
    // TODO: usuwanie etapów
    // TODO: usuwanie kolumn
    // TODO: usunięcie projektu
    // TODO: ustawienie kolejności

    return this.removeElementsOfProject(id).then(()=>{
      return this.orderRemovedProject(id).then(updatedProjects=>{
        return this.repository.remove(id).then(()=>{
          return Promise.resolve(updatedProjects);
        });
      });
    });
  }

  private removeElementsOfProject(projectId: number): Promise<void>{
    return Promise.all([
      this.kanbanColumnService.removeByProject(projectId)
    ]).then(_=>{
      return Promise.resolve(null);
    })
  }

  private orderRemovedProject(projectId: number): Promise<Project[]>{
    return this.repository.findById(projectId).then(project=>{
      return this.orderController.remove(project);
    });
  }

  public update(project: Project): Promise<Project> {
    return this.repository.update(project).then(_=>{
      return Promise.resolve(project);
    })
  }

  public changeOrder(currentTask: Project, previousTask: Project, currentIndex: number, previousIndex: number): Promise<Project[]> {
    return this.orderController.move(currentTask, previousTask, currentIndex, previousIndex);
  }
}
