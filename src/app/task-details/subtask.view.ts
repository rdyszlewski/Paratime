import { Stage } from 'app/data/models/stage';
import { DataService } from 'app/data.service';

export class TaskDetailsView {
  private _stages: Stage[] = [];

  public get stages(): Stage[] {
    return this._stages;
  }

  public init(projectId: number) {
    this.loadStages(projectId);
  }

  private loadStages(projectId: number) {
    if (projectId) {
      DataService.getStoreManager()
        .getStageStore()
        .getStagesByProject(projectId)
        .then((stages) => {
          this._stages = stages;
        });
    }
  }
}
