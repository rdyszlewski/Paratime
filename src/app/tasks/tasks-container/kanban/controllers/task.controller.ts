import { KanbanModel } from '../kanban.model';
import { KanbanColumn, KanbanTask } from 'app/database/data/models/kanban';
import { InsertTaskData } from 'app/database/data/common/models/insert.task.data';
import { DataService } from 'app/data.service';
import { Task } from 'app/database/data/models/task';

export class KanbanTaskController {
  private model: KanbanModel;

  constructor(model: KanbanModel) {
    this.model = model;
  }

  // ADDING
  public addTask(column: KanbanColumn) {
    const task = this.prepareTaskToInsert();
    const data = new InsertTaskData(task, column, this.model.getProject().getId());

    DataService.getStoreManager()
      .getTaskStore()
      .createTask(data)
      .then((result) => {
        this.model.updateTasks(result.updatedKanbanTasks, data.column.getId());
      });
  }

  private prepareTaskToInsert() {
    const task = new Task(this.model.getNewTaskName());
    task.setProject(this.model.getProject());
    return task;
  }
}
