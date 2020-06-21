
import Dexie from 'dexie'
import { Task } from 'app/models/task';
import { Subtask } from 'app/models/subtask';
import { Project } from 'app/models/project';
import { Tag } from 'app/models/tag';
import { TaskTagsModel } from '../common/models';


export class LocalDatabase extends Dexie{

    // TODO: dodać wszystkie tabele

    private dbVersion = 1;

    private tasksTable: Dexie.Table<Task, number>;
    private subtasksTable: Dexie.Table<Subtask, number>;
    private projectsTable: Dexie.Table<Project, number>;
    private tagsTable: Dexie.Table<Tag, number>;
    private taskTagsTable: Dexie.Table<TaskTagsModel, number>;

    constructor(){
        super("Database");
        this.createTables();
    }

    private createTables(){
        console.log("Tworzenie bazy danych");
        // TODO: przejrzeć, czy tutaj są zawarte wszystkie zmienne
        this.version(this.dbVersion).stores({
            tasks: '++id, name, description, endDate, plannedTime, status, progress, projectID',
            subtasks: '++id, name, description, status, progress, taskID',
            projects: '++id, name, description, startDate, endDate, status, type',
            tags: '++id, name',
            task_tags: '[taskId+tagId]'
        });

        this.tasksTable = this.table('tasks');
        this.subtasksTable = this.table('subtasks');
        this.projectsTable = this.table('projects');
        this.tagsTable = this.table('tags');
        this.taskTagsTable = this.table('task_tags');
    }

    public getTasksTable(){
        return this.tasksTable;
    }

    public getSubtasksTable(){
        return this.subtasksTable;
    }

    public getProjectsTable(){
        return this.projectsTable;
    }

    public getTagsTable(){
        return this.tagsTable;
    }

    public getTaskTagsTable(){
        return this.taskTagsTable;
    }

}
