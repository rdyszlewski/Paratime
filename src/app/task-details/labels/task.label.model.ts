import { Label } from 'app/data/models/label';
import { TaskDetails } from '../model/model';

export class TaskLabelsModel{

    private model: TaskDetails;
    private labels: Label[] = [];

    constructor(model:TaskDetails){
        this.model = model;
    }

    public getLabels():Label[]{
        return this.labels;
    }

    public setLabels(labels: Label[]){
        this.labels = labels;
        this.repairTaskLabels(labels);
    }

    private repairTaskLabels(labels:Label[]){
        let toRemove = [];
        this.model.getTask().getLabels().forEach(label=>{
          const foundLabel = labels.find(x=>x.getId()==label.getId());
          if(foundLabel){
            label.setName(foundLabel.getName());
          } else {
            toRemove.push(label);
          }
        });

        toRemove.forEach(label=>{
          this.model.getTask().removeLabel(label);
        });
    }
}
