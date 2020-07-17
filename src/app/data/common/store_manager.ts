import { ProjectStore } from './store/project_store';
import { TaskStore } from './store/task_store';
import { SubtaskStore } from './store/subtask_store';
import { LabelStore } from './store/label_store';
import { IDataSource } from './source';
import { StageStore } from './store/stage_store';
import { PomodoroStore } from './store/pomodoro_store';

export class StoreManager{

    private projectStore: ProjectStore;
    private taskStore: TaskStore;
    private subtaskStore: SubtaskStore;
    private labelStore: LabelStore;
    private stageStore: StageStore;
    private pomodoroStore: PomodoroStore;

    constructor(dataSource: IDataSource){
        this.labelStore = new LabelStore(dataSource.getLabelRepository(), dataSource.getTaskLabelsRepository());
        this.subtaskStore = new SubtaskStore(dataSource.getSubtaskRepository());
        this.stageStore = new StageStore(dataSource.getStageRepository());
        this.taskStore = new TaskStore(dataSource.getTaskRepository(), this.subtaskStore, this.labelStore, dataSource.getProjectRepository(), this.stageStore);
        this.projectStore = new ProjectStore(dataSource.getProjectRepository(), this.taskStore, this.stageStore);
        this.pomodoroStore = new PomodoroStore(dataSource.getPomodoroRepository());
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

    public getStageStore():StageStore{
        return this.stageStore;
    }

    public getPomodoroStore():PomodoroStore{
        return this.pomodoroStore;
    }
}