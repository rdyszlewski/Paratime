import { DataSource } from '@angular/cdk/table';
import { CollectionViewer } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';
import { TaskEntry, TaskEntryCreator } from '../model';
import { DataService } from 'app/data.service';
import { TaskDataSorter } from '../sorter/task.data.sorter';

export class TaskDataSource implements DataSource<TaskEntry>{

    private tasksSubject = new BehaviorSubject<TaskEntry[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading = this.loadingSubject.asObservable();

    connect(collectionViewer: CollectionViewer): Observable<TaskEntry[]> {
        return this.tasksSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.tasksSubject.complete();
        this.loadingSubject.complete();
    }

   loadTasks(filter="",sortActive="time", sortDirection="asc"){
       this.loadingSubject.next(true);

       // TODO: zrobić, żeby pobierało z określonego miesiąca
       DataService.getStoreManager().getPomodoroStore().getAll().then(results=>{
         console.log(results);
            TaskEntryCreator.create(results).then(entries=>{
              console.log(entries);
                let result = entries.filter(x=>x.getTask().getName().includes(filter));
                result = TaskDataSorter.sort(sortActive, sortDirection, result);
                this.tasksSubject.next(result);
            })
       });
   }




}
