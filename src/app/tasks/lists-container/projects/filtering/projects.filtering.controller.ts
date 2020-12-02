import { ProjectFilterModel } from "./filter_model";
import { ProjectsModel } from "../common/model";
import { DataService } from "app/data.service";

export class ProjectsFilteringController {
  private model: ProjectFilterModel = new ProjectFilterModel();

  constructor(private listModel: ProjectsModel, private dataService: DataService) {
    this.listModel = listModel;
  }

  public getModel(): ProjectFilterModel {
    return this.model;
  }

  public clearFilter() {
    this.model.clear();
    this.searchFilter();
  }

  public searchFilter() {
    // TODO: zrobić to za pomocą filtrowania

    this.dataService
      .getProjectService()
      .getAll()
      .then((projects) => {
        let resultFilter = projects;
        if (this.model.isWithEndDate()) {
          resultFilter = resultFilter.filter((x) => x.getEndDate() != null);
        }
        if (this.model.getStatus() != null) {
          resultFilter = resultFilter.filter((x) => x.getStatus() == this.model.getStatus());
        }
        if (this.model.getProjectType() != null) {
          resultFilter = resultFilter.filter((x) => x.getType() == this.model.getProjectType());
        }
        this.listModel.setProjects(resultFilter);
    });
  }
}
