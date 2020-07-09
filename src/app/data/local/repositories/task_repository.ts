import { ITaskRepository } from '../../common/repositories/task_repository';
import { Task } from 'app/models/task';

export class LocalTaskRepository implements ITaskRepository{

    private table: Dexie.Table<Task, number>

    constructor(table: Dexie.Table<Task, number>){
        this.table = table;
    }

    public findTaskById(id: number): Promise<Task> {
        return this.table.where('id').equals(id).first();
    }

    public findTasksByProject(projectId: number): Promise<Task[]> {
        return this.table.where('projectID').equals(projectId).toArray();
    }

    // TODO: to chyba będzie trzeba jednak przenieść do innej tabeli
    public findTasksByLabel(label: string): Promise<Task[]> {
        throw new Error("Method not implemented");
    }

    public findTasksByName(name: string): Promise<Task[]> {
        return this.table.where('name').equals(name).toArray();
    }

    public findTasksByDescription(description: string): Promise<Task[]> {
        // TODO: zrobić to jakoś inaczej. Dexie nie obsługuje LIKE
        return this.table.where('description').startsWith(description).toArray();
    }

    public findTasksByDeadlineDate(date: Date): Promise<Task[]> {
        return this.table.where('endDate').equals(date).toArray();
    }
    
    public insertTask(task: Task): Promise<number> {
        let taskToSave = this.getTaskCopyReadyToSave(task);
        return this.table.add(taskToSave);
    }

    public updateTask(task: Task): Promise<number> {
        let taskToUpdate = this.getTaskCopyReadyToSave(task);
        return this.table.update(task.getId(), taskToUpdate);
    }

    public removeTask(id: number): Promise<void> {
        return this.table.delete(id);
    }

    public removeTasksByProject(projectId: number): Promise<void> {
        // TODO: przetestować to
        // TODO: sprawdzić, jak powinien wyglądać dostęp do zmiennych
        return this.findTasksByProject(projectId).then(results=>{
            return results.forEach(task => {
                this.table.delete(task['id']);
            });
        });
    }

    private getTaskCopyReadyToSave(task: Task): Task{
        let newTask = new Task(task.getName(), task.getDescription(), task.getStatus());
        if(task.getId()){
            newTask.setId(task.getId());
        }
        newTask.setEndDate(task.getEndDate());
        newTask.setPlannedTime(task.getPlannedTime());
        newTask.setProgress(task.getProgress());
        newTask.setProjectID(task.getProjectID());

        return newTask;
    }
}