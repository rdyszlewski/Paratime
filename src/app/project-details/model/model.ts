import { Project } from 'app/models/project';
import { Stage } from 'app/models/stage';
import { Status } from 'app/models/status';
import { TasksList } from 'app/common/lists/tasks.list';

export class ProjectDetails {
  private project: Project = new Project();
  private stages: TasksList<Stage> = new TasksList();

  constructor() {
  }

  public getStages() {
    return this.stages.getItems();
  }

  public updateStages(stages: Stage[]) {
    this.stages.updateItems(stages);
    this.project.setStages(this.stages.getAllItems());
  }

  public getStageByIndex(index: number){
    return this.stages.getItemByIndex(index);
  }

  public getProject() {
    // TODO: odpowiednie ustawianie dat
    return this.project;
  }

  public setProject(project: Project) {
    if (project) {
      console.log(project);
      console.log(project.getStages());
      this.project = project;
      this.stages.setContainerId(project.getId());
      this.stages.setItems(project.getStages());
      console.log(this.stages.getItems());
    }
  }

  public getName(): Project {
    if (this.project) {
      return this.getName();
    }
    return null;
  }

  public getStartDate() {
    if (this.project) {
      return this.getStartDate();
    }
    return null;
  }
}
