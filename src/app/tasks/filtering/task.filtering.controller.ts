import { TaskFilteringModel } from './task.filtering.model';
import { TasksModel } from '../model';
import { DataService } from 'app/data.service';
import { TaskFilterModel } from '../filter_model';

export class TaskFilteringController{

    private mainModel: TasksModel;
    private model: TaskFilteringModel = new TaskFilteringModel();
    private filter: TaskFilterModel = new TaskFilterModel();

    constructor(mainModel:TasksModel){
        this.mainModel = mainModel;
        this.init();
    }

    public getModel(){
        return this.model;
    }

    // TODO: pomyśleć, jak to sprytnie zrobić
    public getFilter(){
        return this.filter;
    }

    private init(){
        this.loadLabels();
    }

    private loadLabels(){
        DataService.getStoreManager().getLabelStore().getAllLabel().then(labels=>{
          this.model.setLabels(labels);
        });
      }

    public clearFilter(){
        this.getFilter().clear();
        this.searchFilter();
      }
    
      // TODO: prawdopodobnie będzie trzeba to gdzieś przenieść
      public searchFilter(){
        let resultFilter = this.mainModel.getProject().getTasks();
        const filter = this.getFilter();
        if(filter.isImportant()){
          resultFilter = resultFilter.filter(x=>x.isImportant());
        }
        if(filter.isWithEndDate()){
          resultFilter = resultFilter.filter(x=>x.getEndDate()!=null);
        }
        if(filter.getStatus() != null){
          resultFilter = resultFilter.filter(x=>x.getStatus()==filter.getStatus());
        }
        if(filter.getStage() != null){
          resultFilter = resultFilter.filter(x=>x.getProjectStageID() == filter.getStage().getId());
        }
        if(filter.getLabel() != null){
          // TODO: spróbować to napisać jakoś lepiej
          resultFilter = resultFilter.filter(x=>{
            let indices = [];
            x.getLabels().forEach(label=>indices.push(label.getId()));
            return indices.includes(filter.getLabel().getId());
            
          });
        }
        
       
        this.mainModel.setTasks(resultFilter);
      }

      public isOpen(){
          return this.model.isFilterOpen();
      }

      public toggleOpen(){
          this.model.toggleFilterOpen();
      }
}