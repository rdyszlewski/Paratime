import { Task } from 'app/data/models/task';
import { Priority } from 'app/data/models/priority';
import { DateFormatter } from 'app/common/date_formatter';

export class TaskItemInfo{

      // TODO: przenieść to do html
    public getSubtasksList(task:Task){
        let text = "<ul class='tooltip-list'>";
        task.getSubtasks().forEach(subtask=>{
          text += "<li>"+ subtask.getName()+"</li>"
        });
        text+= "</ul>";
        return text;
    }

    public getPriorityText(task:Task):string{
        // TODO: pomyśleć nad oznaczeniem ważnośći zadania
        switch(task.getPriority()){
          case Priority.LEVEL_1:
            return '1';
          case Priority.LEVEL_2:
            return "2";
          case Priority.LEVEL_3:
            return "3";
          case Priority.LEVEL_4:
            return "4";
          case Priority.LEVEL_5:
            return "5";
          default:
            return "0";
        }
      }

    public getEndDateText(task:Task){
        return DateFormatter.format(task.getEndDate());
    }
}
