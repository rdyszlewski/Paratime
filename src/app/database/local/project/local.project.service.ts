import { InsertResult } from 'app/database/shared/insert-result';
import { KanbanColumn } from 'app/database/shared/kanban-column/kanban-column';
import { IKanbanColumnService } from 'app/database/shared/kanban-column/kanban-column.service';
import { Project } from 'app/database/shared/project/project';
import { ProjectFilter } from 'app/database/shared/project/project.filter';
import { ProjectInsertResult } from 'app/database/shared/project/project.insert-result';
import { IProjectService } from 'app/database/shared/project/project.service';
import { StageFilter } from 'app/database/shared/stage/stage.filter';
import { LocalOrderController } from '../order/local.orderable.service';
import { LocalProjectStageRepository } from '../stage/local.stage.repository';
import { LocalProjectRepository } from './local.project.repository';


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
    let stageFiler = StageFilter.getBuilder().setProjectId(project.id).build();
    return this.stageRepository.findByFilter(stageFiler).then(stages=>{
      project.stages = stages;
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
        this.insertDefaultKanbanColumn(insertedProject.id)
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
    defaultColumn.projectId = projectId;
    defaultColumn.default = true;
    return this.kanbanColumnService.create(defaultColumn);
  }

  private insertNewProject(project: Project): Promise<Project>{
    return this.repository.insert(project).then(insertedId=>{
      return this.repository.findById(insertedId);
    });
  }

  public remove(project: Project): Promise<Project[]> {
    // TODO: dodać transakcje
    // TODO: usuwanie zadań
    // TODO: usuwanie etapów
    // TODO: usuwanie kolumn
    // TODO: usunięcie projektu
    // TODO: ustawienie kolejności
    let id = project.id;
    return this.removeElementsOfProject(id).then(()=>{
      return this.orderRemovedProject(id).then(updatedProjects=>{
        return this.repository.remove(project).then(()=>{
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
