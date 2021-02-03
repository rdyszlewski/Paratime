import { TaskFilteringModel } from './task.filtering.model';
import { TasksModel } from '../model';
import { DataService } from 'app/data.service';
import { TaskFilterModel } from '../filter_model';

export class TaskFilteringController {
  private model: TaskFilteringModel = new TaskFilteringModel();
  private filter: TaskFilterModel = new TaskFilterModel();

  constructor(private mainModel: TasksModel, private dataService: DataService) {
    this.init();
  }

  public getModel() {
    return this.model;
  }

  // TODO: pomyśleć, jak to sprytnie zrobić
  public getFilter() {
    return this.filter;
  }

  private init() {
    this.loadLabels();
  }

  private loadLabels() {
    // this.dataService.getLabelService().getAll().then(labels=>{
    //   this.model.setLabels(labels);
    // });
  }

  public clearFilter() {
    this.getFilter().clear();
    this.searchFilter();
  }

  // TODO: prawdopodobnie będzie trzeba to gdzieś przenieść
  public searchFilter() {
    let resultFilter = this.mainModel.getTasks();
    const filter = this.getFilter();
    if (filter.isImportant()) {
      resultFilter = resultFilter.filter((x) => x.important);
    }
    if (filter.isWithEndDate()) {
      resultFilter = resultFilter.filter((x) => x.endDate != null);
    }
    if (filter.getStatus() != null) {
      resultFilter = resultFilter.filter(
        (x) => x.status == filter.getStatus()
      );
    }
    if (filter.getStage() != null) {
      resultFilter = resultFilter.filter(
        (x) => x.projectStageID == filter.getStage().id
      );
    }
    if (filter.getLabel() != null) {
      // TODO: spróbować to napisać jakoś lepiej
      resultFilter = resultFilter.filter((x) => {
        let indices = [];
        x.labels.forEach((label) => indices.push(label.id));
        return indices.includes(filter.getLabel().id);
      });
    }

    this.mainModel.setTasks(resultFilter);
  }

  public isOpen() {
    return this.model.isFilterOpen();
  }

  public toggleOpen() {
    this.model.toggleFilterOpen();
  }
}
