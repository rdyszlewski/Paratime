import { ProjectsModel } from 'app/tasks/lists-container/projects/common/model';
import { DataCommand } from '../../data-commnad';

export class ChangeProjectkOrderCommand extends DataCommand{

  constructor(private currentIndex: number, private previousIndex: number, private model: ProjectsModel){
    super();
  }

  execute() {
    const currentProject = this.model.getProjectByIndex(this.currentIndex);
    const previousProject = this.model.getProjectByIndex(this.previousIndex);
    this._dataService.getProjectService().changeOrder(currentProject, previousProject, this.currentIndex, this.previousIndex).then(updatedProjects=>{
      this.model.updateProjects(updatedProjects);
    });
  }

  unExecute() {
    throw new Error('Method not implemented.');
  }

  getDescription(): string {
    return `Zamiana kolejności projektów`
  }
}
