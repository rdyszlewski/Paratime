import { IKanbanColumnsRepository } from '../repositories/kanban_columns_repository';
import { KanbanColumn, KanbanTask } from 'app/models/kanban';
import { KanbanTaskStore } from './kanban.task.store';

export class KanbanColumnStore{

    private kanbanColumnsRepository: IKanbanColumnsRepository;
    private kanbanTaskStore: KanbanTaskStore;
    // private kanbanTasksRepository: IKanbanTasksRepository;


    constructor(kanbanColumnRepository:IKanbanColumnsRepository, kanbanTaskStore: KanbanTaskStore){
        this.kanbanColumnsRepository = kanbanColumnRepository;
        this.kanbanTaskStore = kanbanTaskStore;
    }

    public getById(columnId: number): Promise<KanbanColumn>{
      return this.kanbanColumnsRepository.findColumnById(columnId).then(column=>{
        // return this.fillKanbanColumn(column);
        return null;
      });
    }

    public getByProject(projectId: number): Promise<KanbanColumn[]>{
      return this.kanbanColumnsRepository.findColumnsByProject(projectId).then(columns=>{
        console.log("getByProject");
        console.log(columns);
        const tasksPromise = columns.map(column=>this.kanbanTaskStore.getByColumn(column.getId()).then(tasks=>{
          column.setKanbanTasks(tasks);
          console.log(column);
          console.log(tasks);
          return Promise.resolve(column);
        }));

        return Promise.all(tasksPromise);
      });
    }

    public getDefaultColumn(projectId: number): Promise<KanbanColumn>{
      return this.kanbanColumnsRepository.findDefaultColumn(projectId);
    }

    public create(column: KanbanColumn): Promise<KanbanColumn>{
      return this.kanbanColumnsRepository.insertColumn(column).then(insertedId=>{
        return this.getById(insertedId);
      });
    }

    private update(column:KanbanColumn): Promise<KanbanColumn>{
      return this.kanbanColumnsRepository.updateColumn(column).then(updatedId=>{
        return Promise.resolve(column);
      });
    }

    public remove(columnId: number): Promise<void>{
      return this.kanbanColumnsRepository.removeColumn(columnId).then(()=>{
        return this.kanbanTaskStore.removeByColumn(columnId);
      });
    }

    public removeByProject(projectId: number): Promise<void>{
      return this.kanbanColumnsRepository.findColumnsByProject(projectId).then(columns=>{
        const promises = columns.map(column=>this.kanbanTaskStore.removeByColumn(column.getId()));
        return Promise.all(promises).then(()=>{
            return this.kanbanColumnsRepository.removeColumnsByProject(projectId);
        });
    })
    }


}
