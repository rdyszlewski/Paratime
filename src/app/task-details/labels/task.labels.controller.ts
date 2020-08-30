import { DataService } from 'app/data.service';
import { TaskDetails } from '../model/model';
import { Label } from 'app/data/models/label';
import { TaskLabelsModel } from './task.label.model';
import { LabelsTask } from 'app/data/common/models';

export class TaskLabelsController{

    private mainModel: TaskDetails;
    private model: TaskLabelsModel;
    private selectedLabels: Label[] = [];

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

    public openChoosingLabels(){
      this.selectedLabels = [];
      this.mainModel.getTask().getLabels().forEach(label=>{
        this.selectedLabels.push(label);
      });
    }

    public selectLabel(label:Label, event:MouseEvent){
      if(this.isLabelSelected(label)){
        this.removeSelectedLabel(label);
      } else {
        this.selectedLabels.push(label);
      }
      event.stopPropagation();
    }

    private removeSelectedLabel(label:Label){
      const index = this.selectedLabels.findIndex(x=>x.getId()==label.getId());
      if(index >= 0){
        this.selectedLabels.splice(index, 1);
      }
    }

    public isLabelSelected(label:Label){
      return this.selectedLabels.find(x=>x.getId() == label.getId()) != null;
    }

    public acceptSelectedLabels(){
      // TODO: dodać sprawdzenie, czy cokolwiek się zmieniło

      if(!this.isChanged()){
        return;
      }
      const selected = [];
      this.selectedLabels.forEach(label=>selected.push(label));
      return this.removeAllLabels().then(()=>{
        const promises = [];
        selected.forEach(label=>{
          promises.push(this.saveLabel(label));
        })
        return Promise.all(promises).then(()=>{
          this.mainModel.getTask().setLabels(selected);
          this.selectedLabels=[];
        });
      })
    }

    private isChanged(){
      const selected = this.selectedLabels;
      const current = this.mainModel.getTask().getLabels();
      if(selected.length == current.length){
        current.forEach(label=>{
          if(!this.isLabelSelected(label)){
            return true;
          }
        });
      } else {
        return true;
      }
      return false;
    }

    private removeAllLabels():Promise<void>{
      // TODO: coś tutaj jest nie tak. Z nazwami funkcji w LabelStore
      return DataService.getStoreManager().getLabelStore().removeTaskLabels(this.mainModel.getTask().getId());
    }

    private saveLabel(label:Label):Promise<LabelsTask>{
      return DataService.getStoreManager().getLabelStore().connectTaskAndLabel(this.mainModel.getTask().getId(), label.getId());
    }

    public cancelChoosingLabels(){
      this.selectedLabels = [];
    }




    public chooseLabel(label:Label){
        // TODO
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
