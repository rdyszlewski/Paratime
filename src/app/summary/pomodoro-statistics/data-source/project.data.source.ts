import { DataSource } from '@angular/cdk/table';
import { ProjectEntry, ProjectEntryCreator } from '../model';
import { CollectionViewer } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataService } from 'app/data.service';
import { ProjectDataSorter } from '../sorter/project.data.sorter';

export class ProjectDataSource implements DataSource<ProjectEntry>{

    private projectsSubjects = new BehaviorSubject<ProjectEntry[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading = this.loadingSubject.asObservable();

    connect(collectionViewer: CollectionViewer): Observable<ProjectEntry[]> {
        return this.projectsSubjects.asObservable();
    }
    disconnect(collectionViewer: CollectionViewer): void {
        this.projectsSubjects.complete();
        this.loadingSubject.complete();
    }

    public loadProjects(filter="", sortActive="time", sortDirection="asc"){
        this.loadingSubject.next(true);

        DataService.getStoreManager().getPomodoroStore().getAll().then(results=>{
            ProjectEntryCreator.create(results).then(entries=>{
                let resultEntries = entries.filter(x=>x.getProject().getName().includes(filter));
                resultEntries = ProjectDataSorter.sort(sortActive, sortDirection, resultEntries);
                this.projectsSubjects.next(resultEntries);
            })
        });
    }
    
}