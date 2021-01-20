import { DataCommand } from 'app/commands/data-commnad';
import { Project } from 'app/database/shared/project/project';
import { ProjectUpdateEvent } from 'app/tasks/details-container/project-details/events/update.event';
import { EventBus } from 'eventbus-ts';

export class UpdateProjectCommand extends DataCommand{

  constructor(private project: Project){
    super();
  }

  public execute() {
    this._dataService.getProjectService().update(this.project).then(updatedProject=>{
      EventBus.getDefault().post(new ProjectUpdateEvent(updatedProject));
    });
  }

  unExecute() {
    throw new Error('Method not implemented.');
  }

  getDescription(): string {
    return `Aktualizacja projektu ${this.project.name}`;
  }

}
