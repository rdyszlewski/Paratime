import { ITaskItem } from 'app/database/data/models/task.item';

export class ListHelper{

  public static remove<T>(item: T, list: T[]){
    const index = list.findIndex(x=>x==item);
    if(index >= 0){
      list.splice(index, 1);
    }
  }
}
