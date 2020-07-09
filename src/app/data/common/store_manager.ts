import { ProjectStore } from './store/project_store';
import { TaskStore } from './store/task_store';
import { SubtaskStore } from './store/subtask_store';
import { LabelStore } from './store/label_store';
import { IDataSource } from './source';

export class StoreManager{

    private projectStore: ProjectStore;
    private taskStore: TaskStore;
    private subtaskStore: SubtaskStore;
    private labelStore: LabelStore;

    constructor(dataSource: IDataSource){
        this.labelStore = new LabelStore(dataSource.getLabelRepository(), dataSource.getTaskLabelsRepository());
        this.subtaskStore = new SubtaskStore(dataSource.getSubtaskRepository());
        this.taskStore = new TaskStore(dataSource.getTaskRepository(), this.subtaskStore, this.labelStore, dataSource.getProjectRepository());
        this.projectStore = new ProjectStore(dataSource.getProjectRepository(), this.taskStore);
    }

    public getProjectStore():ProjectStore{
        return this.projectStore;
    }

    public getTaskStore():TaskStore{
        return this.taskStore;
    }

    public getSubtaskStore():SubtaskStore{
        return this.subtaskStore;
    }

    public getLabelStore():LabelStore{
        return this.labelStore;
    }
}