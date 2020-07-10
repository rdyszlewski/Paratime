
import Dexie from 'dexie'
import { Task } from 'app/models/task';
import { Subtask } from 'app/models/subtask';
import { Project } from 'app/models/project';
import { Label } from 'app/models/label';
import { TaskLabelsModel } from '../common/models';


export class LocalDatabase extends Dexie{

    // TODO: dodać wszystkie tabele

    private dbVersion = 1;

    private tasksTable: Dexie.Table<Task, number>;
    private subtasksTable: Dexie.Table<Subtask, number>;
    private projectsTable: Dexie.Table<Project, number>;
    private labelsTable: Dexie.Table<Label, number>;
    private taskTagsTable: Dexie.Table<TaskLabelsModel, number>;

    constructor(){
        super("Database");
        this.createTables();
    }

    private createTables(){
        console.log("Tworzenie bazy danych");
        // TODO: przejrzeć, czy tutaj są zawarte wszystkie zmienne
        this.version(this.dbVersion).stores({
            tasks: '++id, name, description, endDate, plannedTime, status, progress, projectID, priority',
            subtasks: '++id, name, status, taskId',
            projects: '++id, name, description, startDate, endDate, status, type',
            labels: '++id, name',
            task_labels: '[taskId+labelId], taskId, labelId'
        });

        this.tasksTable = this.table('tasks');
        this.subtasksTable = this.table('subtasks');
        this.projectsTable = this.table('projects');
        this.labelsTable = this.table('labels');
        this.taskTagsTable = this.table('task_labels');

        this.projectsTable.mapToClass(Project);
        this.tasksTable.mapToClass(Task);
        this.subtasksTable.mapToClass(Subtask);
        this.labelsTable.mapToClass(Label);
        this.taskTagsTable.mapToClass(TaskLabelsModel);
        
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

    public getLabelsTable(){
        return this.labelsTable;
    }

    public getTaskLabelsTable(){
        return this.taskTagsTable;
    }

}
