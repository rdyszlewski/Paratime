import { IPomodoroRepository } from 'app/data/common/repositories/pomodoro_repository';
import { PomodoroHistory } from 'app/models/pomodoro.history';
import { takeLast } from 'rxjs/operators';

export class LocalPomodoroRepository implements IPomodoroRepository{

    private table: Dexie.Table<PomodoroHistory, number>;

    constructor(table:Dexie.Table<PomodoroHistory, number>){
        this.table = table;
    }

    public findById(id:number):Promise<PomodoroHistory>{
        return this.table.get(id);
    }

    public findAll(): Promise<PomodoroHistory[]> {
        return this.table.toArray();
    }

    public findByTaskId(taskId: number): Promise<PomodoroHistory[]> {
        return this.table.where("taskId").equals(taskId).toArray();
    }

    public findByProjectId(projectId: number): Promise<PomodoroHistory[]> {
        return this.table.where("projectId").equals(projectId).toArray();
    }

    public findByDate(startDate: Date, endDate: Date): Promise<PomodoroHistory[]> {
        // TODO: sprawdzić to
        let startDateToSave = new Date(startDate.toDateString());
        let endDateToSave = new Date(endDate.toDateString());
        return this.table.where("date").between(startDate, endDate).toArray();
    }

    public insert(entry: PomodoroHistory): Promise<number> {
        return this.table.add(entry);
    }

    public removeByTaskId(taskId: number): Promise<void> {
        // TODO: przetestować to
        return this.findByTaskId(taskId).then(results=>{
            this.removeEntries(results);
        });
    }

    private removeEntries(entries: PomodoroHistory[]):Promise<void[]>{
        const promises = [];
        entries.forEach(entry=>{
            promises.push(this.table.delete(entry["id"]));
        });
        return Promise.all(promises);
    }

    public removeByProject(projectId: number): Promise<void> {
        return this.findByProjectId(projectId).then(results=>{
            this.removeEntries(results);
        })
    }

    public removeByDate(startDate: Date, endDate: Date): Promise<void> {
        return this.findByDate(startDate, endDate).then(results=>{
            this.removeEntries(results);
        })
    }

}