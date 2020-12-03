import { ProjectStore } from './store/project_store';
import { TaskStore } from './store/task_store';
import { SubtaskStore } from './store/subtask_store';
import { LabelStore } from './store/label_store';
import { IDataSource } from './source';
import { StageStore } from './store/stage_store';
import { PomodoroStore } from './store/pomodoro_store';
import { KanbanTaskStore } from './store/kanban.task.store';
import { KanbanColumnStore } from './store/kanban.column.store';

export class StoreManager{

    private projectStore: ProjectStore;
    private taskStore: TaskStore;
    private subtaskStore: SubtaskStore;
    private labelStore: LabelStore;
    private stageStore: StageStore;
    private pomodoroStore: PomodoroStore;
    private kanbanTaskStore: KanbanTaskStore;
    private kanbanColumnStore: KanbanColumnStore;

    constructor(dataSource: IDataSource){
        this.labelStore = new LabelStore(dataSource.getLabelRepository(), dataSource.getTaskLabelsRepository());
        this.subtaskStore = new SubtaskStore(dataSource.getSubtaskRepository());
        this.stageStore = new StageStore(dataSource.getStageRepository());
        this.kanbanTaskStore = new KanbanTaskStore(dataSource.getKanbanTasksRepository(), dataSource.getKanbanColumnsRepository());
        this.kanbanColumnStore = new KanbanColumnStore(dataSource.getKanbanColumnsRepository(), this.kanbanTaskStore)
        this.taskStore = new TaskStore(dataSource.getTaskRepository(), this.subtaskStore, this.labelStore, dataSource.getProjectRepository(), this.stageStore, this.kanbanTaskStore);
        // TODO: uważać w tym miejscu. Może nastąpić problem z inicjalizacją
        this.projectStore = new ProjectStore(dataSource.getProjectRepository(), this.taskStore, this.stageStore, this.kanbanColumnStore);
        this.pomodoroStore = new PomodoroStore(dataSource.getPomodoroRepository());

        this.kanbanTaskStore.setTaskStore(this.taskStore);
    }

    public getProjectStore():ProjectStore{
      return this.projectStore; // TODO: później to zlikwidować
    }


    public getTaskStore():TaskStore{
        return this.taskStore;
    }

    public getPomodoroStore():PomodoroStore{
        return this.pomodoroStore;
    }

    public getKanbanTaskStore():KanbanTaskStore{
      return this.kanbanTaskStore;
    }
}
