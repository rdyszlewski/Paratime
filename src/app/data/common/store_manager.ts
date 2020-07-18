import { ProjectStore } from './store/project_store';
import { TaskStore } from './store/task_store';
import { SubtaskStore } from './store/subtask_store';
import { LabelStore } from './store/label_store';
import { IDataSource } from './source';
import { StageStore } from './store/stage_store';
import { PomodoroStore } from './store/pomodoro_store';
import { KanbanStore } from './store/kanban_store';

export class StoreManager{

    private projectStore: ProjectStore;
    private taskStore: TaskStore;
    private subtaskStore: SubtaskStore;
    private labelStore: LabelStore;
    private stageStore: StageStore;
    private pomodoroStore: PomodoroStore;
    private kanbanStore: KanbanStore;

    constructor(dataSource: IDataSource){
        this.labelStore = new LabelStore(dataSource.getLabelRepository(), dataSource.getTaskLabelsRepository());
        this.subtaskStore = new SubtaskStore(dataSource.getSubtaskRepository());
        this.stageStore = new StageStore(dataSource.getStageRepository());
        this.kanbanStore = new KanbanStore(dataSource.getKanbanColumnsRepository(), dataSource.getKanbanTasksRepository());
        this.taskStore = new TaskStore(dataSource.getTaskRepository(), this.subtaskStore, this.labelStore, dataSource.getProjectRepository(), this.stageStore, this.kanbanStore);
        // TODO: uważać w tym miejscu. Może nastąpić problem z inicjalizacją
        this.projectStore = new ProjectStore(dataSource.getProjectRepository(), this.taskStore, this.stageStore, this.kanbanStore);
        this.pomodoroStore = new PomodoroStore(dataSource.getPomodoroRepository());
        this.kanbanStore.setTaskStore(this.taskStore);
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

    public getKanbanStore():KanbanStore{
        return this.kanbanStore;
    }
}