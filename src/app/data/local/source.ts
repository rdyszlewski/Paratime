import { IDataSource } from '../common/source';
import { ITaskRepository } from '../common/task_repository';
import { IProjectRepository } from '../common/project_repository';
import { ISubtaskRepository } from '../common/subtask_repository';
import { LocalTaskRepository } from './task_repository';
import { LocalProjectRepository } from './project_repository';
import { LocalSubtaskRepository } from './subtask_repository';
import { LocalDatabase as LocalDatabase } from './database';
import { LocalTagRepository } from './tag_repository';
import { LocalTagsTaskRepository } from './task_tags_repository';
import { ITagRepository } from '../common/tag_repository';
import { ITaskTagsRepository } from '../common/task_tags_repository';

export class LocalDataSource implements IDataSource{

    private taskRepository: LocalTaskRepository;
    private projectRepository: LocalProjectRepository;
    private subtaskRepository: LocalSubtaskRepository;
    private tagRepository: LocalTagRepository;
    private taskTagRepository: LocalTagsTaskRepository;

    constructor(){
        let database = new LocalDatabase();
        // TODO: spróbować zrobić to w jakiś inny sposób
        this.taskRepository = new LocalTaskRepository(database.getTasksTable());
        this.projectRepository = new LocalProjectRepository(database.getProjectsTable());
        this.subtaskRepository = new LocalSubtaskRepository(database.getSubtasksTable());
        this.tagRepository = new LocalTagRepository(database.getTagsTable());
        this.taskTagRepository = new LocalTagsTaskRepository(database.getTaskTagsTable());
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

    public getTagRepository(): ITagRepository {
        return this.tagRepository;
    }

    public getTaskTagRepository(): ITaskTagsRepository {
        return this.taskTagRepository;
    }
    

}