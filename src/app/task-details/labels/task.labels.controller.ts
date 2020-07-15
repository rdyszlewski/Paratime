import { DataService } from 'app/data.service';
import { TaskDetails } from '../model/model';
import { TaskLabelsModel } from './task.label.model';
import { Label } from 'app/models/label';

export class TaskLabelsController{

    private mainModel: TaskDetails;
    private model: TaskLabelsModel;

    constructor(model:TaskDetails){
        this.mainModel = model;
        this.model = new TaskLabelsModel(model);
        this.init();
    }

    private init():void{
        this.loadLabels();
    }

    public loadLabels(){
        DataService.getStoreManager().getLabelStore().getAllLabel().then(labels=>{
          this.model.setLabels(labels);
        });
    }  

    public getModel():TaskLabelsModel{
        return this.model;
    }

    public chooseLabel(label:Label){
        DataService.getStoreManager().getLabelStore().connectTaskAndLabel(this.mainModel.getTask().getId(), label.getId()).then(()=>{
          this.mainModel.getTask().addLabel(label);
        });
      }
    
      public removeLabel(label:Label){
        DataService.getStoreManager().getLabelStore().removeLabelFromTask(this.mainModel.getTask().getId(), label.getId()).then(()=>{
          this.mainModel.getTask().removeLabel(label);
          // TODO: dlaczego to tutaj jest ?
          // this.model.setEditedSubtask(null);
        });
      }
}