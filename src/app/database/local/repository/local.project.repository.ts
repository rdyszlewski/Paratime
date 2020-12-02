import { Project } from 'app/database/data/models/project';
import { Status } from 'app/database/data/models/status';
import { ProjectFilter } from 'app/database/filter/project.filter';

export class LocalProjectRepository{
  // TODO: prawdopodobnie będzie trzeba tutaj dość OrderRepository

  constructor(private table: Dexie.Table<Project, number>){

  }

  public findById(id: number): Promise<Project>{
    return this.table.get(id);
  }

  public findByName(name: string): Promise<Project[]>{
    return this.table.where("name").equals(name).toArray();
  }

  public findByFilter(filter: ProjectFilter): Promise<Project[]>{
    let projectFilter = new ProjectRepositoryFilter(filter);
    return this.table.filter(project=>projectFilter.apply(project)).toArray();
  }

  public findAll(): Promise<Project[]>{
    return this.table.toArray();
  }

  public create(project: Project): Promise<number>{
    let preparedProject = this.getPreparedProject(project);
    return this.table.add(preparedProject);
  }

  public remove(id: number): Promise<void>{
    return this.table.delete(id);
  }

  public update(project:Project):Promise<number>{
    let preparedProject = this.getPreparedProject(project);
    return this.table.update(project.getId(), preparedProject);
  }

  // TODO: dodać znajdź pierwsz , znajdź ostatnie, znajdź na postawie nastepnika

  private getPreparedProject(project: Project): Project{
    // TODO: pomyśleć, jak to można obejść
    let newProject = new Project(project.getName(), project.getDescription(), project.getStatus(), project.getType());
    if(project.getId()){
        newProject.setId(project.getId());
    }
    newProject.setStartDate(project.getStartDate());
    newProject.setEndDate(project.getEndDate());
    newProject.setSuccessorId(project.getSuccessorId());
    newProject.setPosition(project.getPosition());

    return newProject;
  }
}

class ProjectRepositoryFilter{

  private conditions: FilterEntry<Project>[] = [];

  constructor(filter: ProjectFilter){
    this.init(filter);
  }

  public init(filter: ProjectFilter){
    this.conditions.push(new FilterEntry(
      ()=>filter.description!=null,
      project=>project.getDescription()==filter.description));

    this.conditions.push(new FilterEntry(
      ()=>filter.finished,
      project=>project.getStatus() == Status.ENDED
    ));

    this.conditions.push(new FilterEntry(
      ()=>filter.startDate != null,
      project=>project.getStartDate() == filter.startDate
    ));

    this.conditions.push(new FilterEntry(
      ()=>filter.endDate != null,
      project=>project.getEndDate() == filter.endDate
    ));

  }

  public apply(project: Project):boolean{
    for(let i=0; i< this.conditions.length; i++){
      let entry = this.conditions[i];
      if(entry.applyCondition() && !entry.applyPredicate(project)){
        return false;
      }
    }
    return true;
  }
}
