import { IKanbanColumnsRepository } from '../repositories/kanban_columns_repository';
import { IKanbanTasksRepository } from '../repositories/kanban_tasks_repository';
import { KanbanColumn, KanbanTask } from 'app/models/kanban';
import { TaskStore } from './task_store';
import { InsertKanbanTaskResult } from '../models/insert.kanban.task.result';
import { InsertTaskData } from '../models/insert.task.data';
import { ok } from 'assert';
import { Task } from 'app/models/task';

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
        const result: InsertKanbanTaskResult = new InsertKanbanTaskResult();

        const kanbanTask = new KanbanTask();
        kanbanTask.setTask(data.task);

        return this.prepareKanbanColumn(data).then(columnId=>{ // get kanban column
            kanbanTask.setColumnId(columnId);
            return columnId;
        }).then(columndId=>{ // find last kanban task
            return this.getLastKanbanTask(columndId);
        }).then(lastTask=>{ // inserty kanban task and update order in last task in column
            return this.insertKanbanTask(kanbanTask).then(insertedTask=>{
                result.insertedKanbanTask = insertedTask;
                if(lastTask){
                    return this.updatePreviousKanbanTask(lastTask, insertedTask).then(updatedTask=>{
                        result.updatedKanbanTask.push(updatedTask);
                    })
                }
            });
        }).then(()=>{
            return Promise.resolve(result);
        });
    }

    private prepareKanbanColumn(data: InsertTaskData){
        let columnPromise:Promise<number>;
        if(data.column != null){
            columnPromise = Promise.resolve(data.column.getId());
        } else {
            columnPromise = this.getDefaultColumn(data.projectId).then(column=>Promise.resolve(column.getId()));
        }
        return columnPromise;
    }

    private insertKanbanTask(kanbanTask:KanbanTask):Promise<KanbanTask>{
        return this.kanbanTasksRepository.insertTask(kanbanTask).then(insertedId=>{
            return this.getKanbanTaskById(insertedId);
        });
    }

    private updatePreviousKanbanTask(lastKanbanTask: KanbanTask, createTask: KanbanTask){
        lastKanbanTask.setSuccessorId(createTask.getId());
        return this.updateKanbanTask(lastKanbanTask);
    }


    // public createKanbanTask(kanbanTask: KanbanTask): Promise<KanbanTask>{
    //     // TODO: utworzenie zadania Kanban

    //     // TODO: ustalenie kolumny, jeśli nie ma
    //     // TODO: pobranie ostatniego zadania kanban w tej kolumnie
    //     // TODO: zapisanie zadania kanban
    //     // TODO: aktualizacja poprzedniego zadania

    //     // TODO: zastanowić się, czy wprowadzanie kolejności w tym miejscu jest odpowiednie
    //     return this.kanbanTasksRepository.insertTask(kanbanTask).then(insertedId=>{
    //         return this.getKanbanTaskById(insertedId);
    //     });
    // }

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
