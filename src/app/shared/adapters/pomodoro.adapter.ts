import { Task } from 'app/database/shared/task/task';
import { Pomodorotask } from 'app/pomodoro/pomodoro/model/task';

export class PomodoroAdapter{

  public static createPomodoroTask(task: Task){
    const pomodoroTask = new Pomodorotask();
    pomodoroTask.setTask(task.getId(), task.getName());
    pomodoroTask.setProject(task.getProject().getId(), task.getProject().getName());
    task.getLabels().forEach(label=>{
      pomodoroTask.addLabel(label.getId(), label.getName());
    });
    return pomodoroTask;
  }
}
