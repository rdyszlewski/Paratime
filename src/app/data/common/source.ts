import { ITaskRepository } from './repositories/task_repository';
import { IProjectRepository } from './repositories/project_repository';
import { ISubtaskRepository } from './repositories/subtask_repository';
import { ITagRepository } from './repositories/tag_repository';
import { ITaskTagsRepository } from './repositories/task_tags_repository';

export interface IDataSource{
    getTaskRepository():ITaskRepository;
    getProjectRepository(): IProjectRepository;
    getSubtaskRepository():ISubtaskRepository;
    getTagRepository(): ITagRepository;
    getTaskTagRepository(): ITaskTagsRepository;
}