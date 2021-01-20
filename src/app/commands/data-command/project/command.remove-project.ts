import { Project } from 'app/database/shared/project/project';
import { ProjectsModel } from 'app/tasks/lists-container/projects/common/model';
import { DataCommand } from '../../data-commnad';

export class RemoveProjectCommand extends DataCommand{
  constructor(private _project: Project, private _model: ProjectsModel){
    super();
  }


  public execute() {
    this._dataService.getProjectService().remove(this._project).then(updatedProjects=>{
      this._model.updateProjects(updatedProjects);
    });
  }

  public unExecute() {
    throw new Error('Method not implemented.');
  }

  public getDescription(): string {
    // TODO: dodać lokalizację
    return `Usunięcię projektu ${this._project.name}`;
  }
}
