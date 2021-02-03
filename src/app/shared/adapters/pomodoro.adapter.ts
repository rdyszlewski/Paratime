import { Task } from 'app/database/shared/task/task';
import { Pomodorotask } from 'app/pomodoro/pomodoro/model/task';

export class PomodoroAdapter{

  public static createPomodoroTask(task: Task){
    const pomodoroTask = new Pomodorotask();
    pomodoroTask.setTask(task.id, task.name);
    pomodoroTask.setProject(task.project.id, task.project.name);
    task.labels.forEach(label=>{
      pomodoroTask.addLabel(label.id, label.name);
    });
    return pomodoroTask;
  }
}
