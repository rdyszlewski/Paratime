import { Project } from 'app/database/shared/project/project';
import { Stage } from 'app/database/shared/stage/stage';
import { TasksList } from 'app/shared/common/lists/tasks.list';

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
