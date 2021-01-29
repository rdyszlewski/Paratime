import { DataService } from 'app/data.service';
import { TaskDetails } from '../model/model';
import { Label } from 'app/database/shared/label/label';
import { TaskLabelsModel } from './task.label.model';
import { CommandService } from 'app/commands/manager/command.service';
import { RemoveLabelAssignignCommand } from 'app/commands/data-command/label/command.remove-label-assigning';
import { AssingLabelCommand } from 'app/commands/data-command/label/command.assign-label';

export class TaskLabelsController{

    private model: TaskLabelsModel;
    private selectedLabels: Label[] = [];

    constructor(private mainModel:TaskDetails, private dataService: DataService, private commandService: CommandService){
        this.model = new TaskLabelsModel(mainModel);
        this.init();
    }

    private init():void{
        this.loadLabels();
    }

    public loadLabels(){
        this.dataService.getLabelService().getAll().then(labels=>{
          this.model.setLabels(labels);
        });
    }

    public getModel():TaskLabelsModel{
        return this.model;
    }

    public openChoosingLabels(){
      this.selectedLabels = [];
      this.mainModel.getTask().labels.forEach(label=>{
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
      const index = this.selectedLabels.findIndex(x=>x.id==label.id);
      if(index >= 0){
        this.selectedLabels.splice(index, 1);
      }
    }

    public isLabelSelected(label:Label){
      return this.selectedLabels.find(x=>x.id == label.id) != null;
    }

    public acceptSelectedLabels(){
      // TODO: dodać sprawdzenie, czy cokolwiek się zmieniło

      if(!this.isChanged()){
        return;
      }
      const selected = this.selectedLabels.map(label=>label)
      this.selectedLabels = [];
      this.commandService.execute(new AssingLabelCommand(selected, this.mainModel.getTask()));
    }

    private isChanged(){
      const selected = this.selectedLabels;
      const current = this.mainModel.getTask().labels;
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

    public cancelChoosingLabels(){
      this.selectedLabels = [];
    }

    public removeLabel(label:Label){
      this.commandService.execute(new RemoveLabelAssignignCommand(this.mainModel.getTask(), label));
    }
}
