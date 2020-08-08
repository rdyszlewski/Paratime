import { IKanbanColumnsRepository } from '../repositories/kanban_columns_repository';
import { IKanbanTasksRepository } from '../repositories/kanban_tasks_repository';
import { KanbanColumn, KanbanTask } from 'app/models/kanban';
import { TaskStore } from './task_store';
import { InsertKanbanTaskResult } from '../models/insert.kanban.task.result';
import { InsertTaskData } from '../models/insert.task.data';
import { Position } from 'app/models/orderable.item';

export class KanbanStore{

    private kanbanColumnsRepository: IKanbanColumnsRepository;
    private kanbanTasksRepository: IKanbanTasksRepository;
    private taskStore: TaskStore;

    constructor(kanbanColumnsRepository: IKanbanColumnsRepository,
                kanbanTasksRepository: IKanbanTasksRepository,
                ){
        this.kanbanColumnsRepository = kanbanColumnsRepository;
        this.kanbanTasksRepository = kanbanTasksRepository;
        // this.taskStore = taskStore;
    }

    //TODO: obmyślić to jakoś inaczej
    public setTaskStore(taskStore: TaskStore){
        this.taskStore = taskStore;
    }

    public getColumnById(columnId:number): Promise<KanbanColumn>{
        // TODO: refaktoryzacja
        return this.kanbanColumnsRepository.findColumnById(columnId).then(column=>{
            return this.fillKanbanColumn(column);
        });
    }

    private fillKanbanColumn(column: KanbanColumn): Promise<KanbanColumn>{
        return this.kanbanTasksRepository.findTasksByColumn(column.getId()).then(kanbanTasks=>{
            column.setKanbanTasks(kanbanTasks);
            const promises = [];
            kanbanTasks.forEach(entry=>{
                promises.push(this.fillKanbanTask(entry));
            });
            return Promise.all(promises).then(()=>{
                return Promise.resolve(column);
            })
        })
    }

    private fillKanbanTask(kanbanTask: KanbanTask): Promise<KanbanTask>{
        return this.taskStore.getTaskById(kanbanTask.getTaskId()).then(task=>{
            kanbanTask.setTask(task);
            return Promise.resolve(kanbanTask);
        })
    }

    public getColumnsByProject(projectId: number): Promise<KanbanColumn[]>{
        // TODO: przetestować to
        return this.kanbanColumnsRepository.findColumnsByProject(projectId).then(columns=>{
            const promises = [];
            columns.forEach(column=>{
                promises.push(this.fillKanbanColumn(column));
            });
            return Promise.all(promises);
        });
    }

    public getDefaultColumn(projectId: number): Promise<KanbanColumn>{
        return this.kanbanColumnsRepository.findDefaultColumn(projectId);
    }

    public createColumn(column: KanbanColumn): Promise<KanbanColumn>{
        return this.kanbanColumnsRepository.insertColumn(column).then(insertedId=>{
            return this.getColumnById(insertedId);
        });
    }

    public createFirtKanbanTask(columnId){
        const kanbanTask = new KanbanTask();
        kanbanTask.setColumnId(columnId);

    }

    public updateColumn(column: KanbanColumn): Promise<KanbanColumn>{
        return this.kanbanColumnsRepository.updateColumn(column).then(updatedId=>{
            return Promise.resolve(column);
        });
    }

    public removeColumn(columnId: number): Promise<void>{
        return this.kanbanColumnsRepository.removeColumn(columnId).then(()=>{
            return this.kanbanTasksRepository.removeTasksByColumn(columnId);
        });
    }

    public removeColumnsByProject(projectId: number): Promise<void>{
        // TODO: poprawić to na coś lepszego
        return this.kanbanColumnsRepository.findColumnsByProject(projectId).then(columns=>{
            const promises = [];
            columns.forEach(column=>{
                promises.push(this.kanbanTasksRepository.removeTasksByColumn(column.getId()));
            })
            return Promise.all(promises).then(()=>{
                return this.kanbanColumnsRepository.removeColumnsByProject(projectId);
            })
        })
    }

    public getKanbanTaskById(id: number): Promise<KanbanTask>{
        return this.kanbanTasksRepository.findTaskById(id).then(kanbanTask=>{
            return this.fillKanbanTask(kanbanTask);
        })
    }

    public createKanbanTask(data: InsertTaskData):Promise<InsertKanbanTaskResult>{
        // find column. If the column is not given, we look for default column
        // find last kanban task in the column
        // insert new kanban task
        // set the order of kanban tasks
        // if the last kanban task exists, update it
        // return result

      const result: InsertKanbanTaskResult = new InsertKanbanTaskResult();
      return this.prepareKanbanColumn(data).then(column=>{
        return this.getLastKanbanTask(column.getId()).then(lastTask=>{
          const kanbanTask = this.createKanbanTaskToInsert(data, column.getId());
          kanbanTask.setPosition(!lastTask?Position.HEAD: Position.NORMAL);
          return this.insertKanbanTask(kanbanTask).then(insertedTask=>{
            result.insertedKanbanTask = insertedTask;
            if(lastTask){
              return this.updatePreviousKanbanTask(lastTask, insertedTask).then(updatedTask=>{
                result.updatedKanbanTask.push(updatedTask);
                return Promise.resolve(result);
              });

            }
             // TODO: spróbować zrobić, żeby to występowało tylko raz
            return Promise.resolve(result);
          });
        });
      });
    }

  private createKanbanTaskToInsert(data: InsertTaskData, columnId: number) {
    const kanbanTask = new KanbanTask();
    kanbanTask.setTask(data.task);
    kanbanTask.setColumnId(columnId);
    return kanbanTask;
  }

    private prepareKanbanColumn(data: InsertTaskData):Promise<KanbanColumn>{
        let columnPromise:Promise<KanbanColumn>;
        if(data.column != null){
            columnPromise = Promise.resolve(data.column);
        } else {
          columnPromise = this.getDefaultColumn(data.projectId);
      }
        return columnPromise;
    }

    private insertKanbanTask(kanbanTask:KanbanTask):Promise<KanbanTask>{
        return this.kanbanTasksRepository.insertTask(kanbanTask).then(insertedId=>{
            return this.getKanbanTaskById(insertedId);
        });
    }

    private updatePreviousKanbanTask(lastKanbanTask: KanbanTask, createTask: KanbanTask){
      // TODO: później wstawić tutaj kod odpowiedzialny za kolejność. zrobić tak samo jak w przypadku createTask w TaskStore
        lastKanbanTask.setSuccessorId(createTask.getId());
        return this.updateKanbanTask(lastKanbanTask);
    }

    public getLastKanbanTask(columnId:number){
        return this.kanbanTasksRepository.findLastTask(columnId);
    }

    public getFirstKanbanTask(columnId: number){
        return this.kanbanTasksRepository.findFirstTask(columnId);
    }

    public updateKanbanTask(kanbanTask: KanbanTask): Promise<KanbanTask>{
        return this.kanbanTasksRepository.updateTask(kanbanTask).then(result=>{
            return Promise.resolve(kanbanTask);
        });
    }

    public removeKanbanTask(kanbanTaskId: number): Promise<void>{
        return this.kanbanTasksRepository.removeTask(kanbanTaskId);
    }


}
