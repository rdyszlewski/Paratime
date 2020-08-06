import { ITaskRepository } from '../../common/repositories/task_repository';
import { Task } from 'app/models/task';
import { Position } from 'app/models/orderable.item';
import { Status } from 'app/models/status';

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

    public findTasksByDate(date: Date): Promise<Task[]> {
        // TODO: sprawdzić, dlaczego to działa
        let d = new Date(date.toDateString());
        return this.table.where('date').equals(d).toArray();
    }

    public findTasksByDeadlineDate(date: Date): Promise<Task[]> {
        return this.table.where('endDate').equals(date).toArray();
    }

    public findTasksByStatus(projectId: number, status: Status): Promise<Task[]> {
      return this.table.where({"projectID": projectId, "status":status}).toArray();
    }

    public findTasksExceptStatus(projectId: number, status: Status): Promise<Task[]> {
      // TODO: sprawdzić, czy to będzie dobrze działać
      // return this.table.where({"projectID":projectId, "status": !status}).toArray();
      return this.table.where("projectID").equals(projectId).and(x=>x['status']!=status).toArray();
    }

    public findImportantTasks(): Promise<Task[]> {
        return this.table.where('important').equals(1).toArray();
    }

    public findFirstTask(projectId: number): Promise<Task> {
        return this.table.where({"position":Position.HEAD, "projectID":projectId}).first();
    }

    public findLastTask(projectId: number): Promise<Task> {
        return this.table.where({"successor":-1, "projectID":projectId}).first();
    }

    public findFirstTaskWithStatus(projectId, status:Status): Promise<Task>{
      return this.table.where({"position":Position.HEAD, "projectID":projectId, "status": status}).first();
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
        newTask.setImportant(task.isImportant());
        newTask.setDate(task.getDate());
        newTask.setTime(task.getTime());
        newTask.setEndDate(task.getEndDate());
        newTask.setPlannedTime(task.getPlannedTime());
        newTask.setProgress(task.getProgress());
        newTask.setProjectID(task.getProjectID());
        newTask.setPriority(task.getPriority());
        newTask.setProjectStageID(task.getProjectStageID());
        newTask.setSuccessorId(task.getSuccessorId());
        newTask.setPosition(task.getPosition());

        return newTask;
    }
}
