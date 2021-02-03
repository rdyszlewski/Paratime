import { TaskDetails } from './model';
import { Task } from 'app/database/shared/task/task';

export class TaskChangeDetector{

    private model: TaskDetails;
    private originTask: Task;

    constructor(model: TaskDetails){
        this.model = model;
        this.originTask = this.copyTask(model.getTask());
    }

    // TODO: sprawdzić, kiedy to jest wykorzystywane
    private copyTask(task:Task):Task{
        // TODO: można to dokończyć i przenieść do innej klasy
        const newTask = new Task();
        newTask.name = task.name;
        newTask.description = task.description;
        newTask.status = task.status;
        newTask.endDate = task.endDate;
        newTask.plannedTime = task.plannedTime;

        return newTask;
    }

    public isNameChanged(){
        if(this.model.getTask() != null && this.originTask != null){
            return this.model.getTask().name != this.originTask.name;
        }
        return false;
    }
}
