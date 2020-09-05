import { TaskDetails } from './model';
import { Task } from 'app/data/models/task';

export class TaskChangeDetector{

    private model: TaskDetails;
    private originTask: Task;

    constructor(model: TaskDetails){
        this.model = model;
        this.originTask = this.copyTask(model.getTask());
    }

    private copyTask(task:Task):Task{
        // TODO: można to dokończyć i przenieść do innej klasy
        const newTask = new Task();
        newTask.setName(task.getName());
        newTask.setDescription(task.getDescription());
        newTask.setStatus(task.getStatus());
        newTask.setEndDate(task.getEndDate());
        newTask.setPlannedTime(task.getPlannedTime());

        return newTask;
    }

    public isNameChanged(){
        if(this.model.getTask() != null && this.originTask != null){
            return this.model.getTask().getName() != this.originTask.getName();
        }
        return false;
    }
}
