import { Project } from 'app/database/shared/project/project';
import { ProjectInsertResult } from 'app/database/shared/project/project.insert-result';
import { TaskInsertResult } from 'app/database/shared/task/task.insert-result';
import { ProjectsModel } from 'app/tasks/lists-container/projects/common/model';
import { ProjectLoadEvent } from 'app/tasks/lists-container/projects/events/project.event';
import { EventBus } from 'eventbus-ts';
import { DataCommand } from '../data-commnad';

export class CreateProjectCommand extends DataCommand{


  private _insertResult: ProjectInsertResult;

  constructor(private _project: Project, private _model: ProjectsModel){
    super();
  }

  public execute() {
    console.log("Wstawianie projektu");
    this._dataService.getProjectService().create(this._project).then(result=>{
      this._insertResult = result;
      this._model.updateProjects(result.updatedProjects);
      EventBus.getDefault().post(new ProjectLoadEvent(result.insertedProject));
    });
  }

  unExecute() {
    // TODO: zrobić usuwanie wstawionego projektu
    throw new Error('Method not implemented.');
  }

  public getDescription(): string {
    return `Dodanie projektu ${this._project.getName()}`;
  }
}
