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
import { DexieProjectDTO } from './local.project';
import { LocalProjectRepository } from './local.project.repository';


export class LocalProjectService implements IProjectService{

  // TODO: sprawdzić, czy ten typ jest opdowiedni
  private orderController: LocalOrderController<DexieProjectDTO>;

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

  private fetchProject(projectDTO: DexieProjectDTO):Promise<Project>{
    if(!projectDTO){
      return Promise.resolve(null);
    }
    // TODO: sprawdzić, czy to jest ok

    let stageFiler = StageFilter.getBuilder().setProjectId(projectDTO.id).build();
    let project = projectDTO.getModel();
    return this.stageRepository.findByFilter(stageFiler).then(stages=>{
      project.stages = stages.map(x=>x.getModel());
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
    let promise =  this.repository.findAll();
    return this.mapToProjectPromise(promise);
  }

  private mapToProjectPromise(dtoPromise: Promise<DexieProjectDTO[]>): Promise<Project[]>{
    return dtoPromise.then(elements=>{
      let projects = elements.map(x=>x.getModel());
      return Promise.resolve(projects);
    })
  }

  public create(project: Project): Promise<ProjectInsertResult> {
     return this.insertNewProject(project).then(insertedProject=>{
      return Promise.all([
        this.orderController.insert(insertedProject, null, null),
        this.insertDefaultKanbanColumn(insertedProject.id)
      ]).then(results=>{
        console.log(results);
        // TODO: coś ze wstawianiem elementów jest nie tak
        return this.createInsertResult(insertedProject, results[0], results[1]);
      })
    });
  }

  private createInsertResult(insertedProject: DexieProjectDTO, updatedProject: DexieProjectDTO[], kanbanResult: InsertResult<KanbanColumn>) {
    let result = new ProjectInsertResult(insertedProject.getModel());
    result.updatedProjects = updatedProject.map(x=>x.getModel());
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

  private insertNewProject(project: Project): Promise<DexieProjectDTO>{
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
        return this.repository.remove(project.id).then(()=>{
          return Promise.resolve(updatedProjects.map(x=>x.getModel()));
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

  // TODO: sprawdzić, czy ten typ jest ok
  private orderRemovedProject(projectId: number): Promise<DexieProjectDTO[]>{
    return this.repository.findById(projectId).then(project=>{
      return this.orderController.remove(project);
    });
  }

  public update(project: Project): Promise<Project> {
    return this.repository.findById(project.id).then(projectDTO=>{
      projectDTO.update(project);
      return this.repository.update(projectDTO).then(_=>{
        return Promise.resolve(project);
      });
    });
  }

  public changeOrder(currentTask: Project, previousTask: Project, currentIndex: number, previousIndex: number): Promise<Project[]> {
    // TODO: pobranie pierwszego elementu
    // TODO: pobranie drugiego elementu
    // TODO: przestawienie kolejności
    let promises = [
      this.repository.findById(currentTask.id),
      this.repository.findById(previousTask.id)
    ];
    return Promise.all(promises).then(projects=>{
      return this.orderController.move(projects[0], projects[2], currentIndex, previousIndex).then(result=>{
        return Promise.resolve(result.map(x=>x.getModel()));
        // return this.mapToProjectPromise(result);
      });
    });
    // return this.orderController.move(currentTask, previousTask, currentIndex, previousIndex);
  }
}
