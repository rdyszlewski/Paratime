import { IDataSource } from '../common/source';
import { ITaskRepository } from '../common/repositories/task_repository';
import { IProjectRepository } from '../common/repositories/project_repository';
import { ISubtaskRepository } from '../common/repositories/subtask_repository';
import { LocalTaskRepository } from './repositories/task_repository';
import { LocalProjectRepository } from './repositories/project_repository';
import { LocalSubtaskRepository } from './repositories/subtask_repository';
import { LocalDatabase as LocalDatabase } from './database';
import { LocalLabelRepository as LocalLabelRepository } from './repositories/label_repository';
import { LocalTaskLabelsRepository as LocalTaskLabelsRepository } from './repositories/task_labels_repository';
import { ILabelRepository } from '../common/repositories/label_repository';
import { ITaskLabelsRepository } from '../common/repositories/task_labels_repository';
import { LocalProjectStageRepository } from './repositories/stage_repository';
import { IProjectStageRepository } from '../common/repositories/stage_repository';
import { LocalPomodoroRepository } from './repositories/pomodoro_repository';
import { IPomodoroRepository } from '../common/repositories/pomodoro_repository';
import { LocalKanbanColumnsRepository } from './repositories/kanban_columns_repository';
import { LocalKanbanTasksRepository } from './repositories/kanban_tasks_repository';
import { IKanbanColumnsRepository } from '../common/repositories/kanban_columns_repository';
import { IKanbanTasksRepository } from '../common/repositories/kanban_tasks_repository';

export class LocalDataSource implements IDataSource{

    private taskRepository: LocalTaskRepository;
    private projectRepository: LocalProjectRepository;
    private subtaskRepository: LocalSubtaskRepository;
    private labelRepository: LocalLabelRepository;
    private taskLabelsRepository: LocalTaskLabelsRepository;
    private stageRepository: LocalProjectStageRepository;
    private pomodoroRepository: LocalPomodoroRepository;
    private kanbanColumnsRepository: LocalKanbanColumnsRepository;
    private kanbanTasksRepository: LocalKanbanTasksRepository;

    constructor(){
        let database = new LocalDatabase();
        // TODO: spróbować zrobić to w jakiś inny sposób
        this.taskRepository = new LocalTaskRepository(database.getTasksTable());
        this.projectRepository = new LocalProjectRepository(database.getProjectsTable());
        this.subtaskRepository = new LocalSubtaskRepository(database.getSubtasksTable());
        this.labelRepository = new LocalLabelRepository(database.getLabelsTable());
        this.taskLabelsRepository = new LocalTaskLabelsRepository(database.getTaskLabelsTable());
        this.stageRepository = new LocalProjectStageRepository(database.getStagesTable());
        this.pomodoroRepository = new LocalPomodoroRepository(database.getPomodoroTable());
        this.kanbanColumnsRepository = new LocalKanbanColumnsRepository(database.getKanbanColumnsTable());
        this.kanbanTasksRepository = new LocalKanbanTasksRepository(database.getKanbanTasksTable());
    }
    
    public getTaskRepository(): ITaskRepository {
        return this.taskRepository;
    }
    
    public getProjectRepository(): IProjectRepository {
        return this.projectRepository;
    }
    
    public getSubtaskRepository(): ISubtaskRepository {
        return this.subtaskRepository;
    }

    public getLabelRepository(): ILabelRepository {
        return this.labelRepository;
    }

    public getTaskLabelsRepository(): ITaskLabelsRepository {
        return this.taskLabelsRepository;
    }
    
    public getStageRepository():IProjectStageRepository{
        return this.stageRepository;
    }

    public getPomodoroRepository():IPomodoroRepository{
        return this.pomodoroRepository;
    }

    public getKanbanColumnsRepository(): IKanbanColumnsRepository {
        return this.kanbanColumnsRepository;
    }
    
    public getKanbanTasksRepository(): IKanbanTasksRepository {
        return this.kanbanTasksRepository;
    }

}