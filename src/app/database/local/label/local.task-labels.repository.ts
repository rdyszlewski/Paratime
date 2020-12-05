import { LabelsTask } from 'app/database/shared/label/labels-task';

export class LocalTaskLabelsRepository{

  constructor(private table: Dexie.Table<LabelsTask, number>){

  }

  public findById(id: number): Promise<LabelsTask>{
    return this.table.get(id);
  }

  public findByTaskId(taskId: number): Promise<LabelsTask[]>{
    return this.table.where("taskId").equals(taskId).toArray();
  }

  public findByLabelId(labelId: number): Promise<LabelsTask[]>{
    return this.table.where("labelId").equals(labelId).toArray();
  }

  public insert(entry: LabelsTask): Promise<number>{
    return this.table.add(entry);
  }

  public remove(entry:LabelsTask): Promise<void>{
    return this.table.where({
      "taskId": entry.getTaskId(),
      "labelId":entry.getLabelId()
    }).delete().then(()=>{
      return Promise.resolve();
    })
  }

  public removeByTaskId(taskId: number): Promise<number>{
    return this.table.where("taskId").equals(taskId).delete();
  }

  public removeByLabelId(labelId: number): Promise<number>{
    return this.table.where("labelId").equals(labelId).delete();
  }
}
