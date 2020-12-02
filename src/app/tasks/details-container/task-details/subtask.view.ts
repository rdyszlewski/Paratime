import { DataService } from 'app/data.service';
import { Stage } from 'app/database/data/models/stage';
import { StageFilter } from 'app/database/filter/stage.filter';

export class TaskDetailsView {
  private _stages: Stage[] = [];

  public get stages(): Stage[] {
    return this._stages;
  }

  constructor(private dataService: DataService){

  }

  public init(projectId: number) {
    this.loadStages(projectId);
  }

  private loadStages(projectId: number) {
    if (projectId) {
      let filter = StageFilter.getBuilder().setProjectId(projectId).build();
      this.dataService.getStageService().getByFilter(filter);
    }
  }
}
