import { ITaskRepository } from './task_repository';
import { IProjectRepository } from './project_repository';
import { ISubtaskRepository } from './subtask_repository';
import { ITagRepository } from './tag_repository';
import { ITaskTagsRepository } from './task_tags_repository';

export interface IDataSource{
    getTaskRepository():ITaskRepository;
    getProjectRepository(): IProjectRepository;
    getSubtaskRepository():ISubtaskRepository;
    getTagRepository(): ITagRepository;
    getTaskTagRepository(): ITaskTagsRepository;
}