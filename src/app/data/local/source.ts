import { IDataSource } from '../common/source';
import { ITaskRepository } from '../common/repositories/task_repository';
import { IProjectRepository } from '../common/repositories/project_repository';
import { ISubtaskRepository } from '../common/repositories/subtask_repository';
import { LocalTaskRepository } from './repositories/task_repository';
import { LocalProjectRepository } from './repositories/project_repository';
import { LocalSubtaskRepository } from './repositories/subtask_repository';
import { LocalDatabase as LocalDatabase } from './database';
import { LocalTagRepository } from './repositories/tag_repository';
import { LocalTagsTaskRepository } from './repositories/task_tags_repository';
import { ITagRepository } from '../common/repositories/tag_repository';
import { ITaskTagsRepository } from '../common/repositories/task_tags_repository';

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