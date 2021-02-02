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
    this.project.stages = this.stages.getAllItems();

  }

  public addStage(stage: Stage){
    this.stages.addItem(stage);
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
      this.project = project;
      this.stages.setContainerId(project.id);
      this.stages.setItems(project.stages);
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
