import { ProjectStore } from './store/project_store';
import { TaskStore } from './store/task_store';
import { SubtaskStore } from './store/subtask_store';
import { TagStore } from './store/tag_store';
import { IDataSource } from './source';

export class StoreManager{

    private projectStore: ProjectStore;
    private taskStore: TaskStore;
    private subtaskStore: SubtaskStore;
    private tagStore: TagStore;

    constructor(dataSource: IDataSource){
        this.tagStore = new TagStore(dataSource.getTagRepository(), dataSource.getTaskTagRepository());
        this.subtaskStore = new SubtaskStore(dataSource.getSubtaskRepository());
        this.taskStore = new TaskStore(dataSource.getTaskRepository(), this.subtaskStore, this.tagStore);
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

    public getTagStore():TagStore{
        return this.tagStore;
    }
}