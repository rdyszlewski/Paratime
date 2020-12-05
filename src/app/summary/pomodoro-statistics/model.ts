import { Task } from 'app/database/data/models/task';
import { Project } from 'app/database/data/models/project';
import { PomodoroHistory } from 'app/database/data/models/pomodoro.history';
import { DataService } from 'app/data.service';

export class PomodoroStatisticsModel{
    private tasksEntries: TaskEntry[] = [];
    private projectsEntries: ProjectEntry[] = [];

    public getTasksEntries():TaskEntry[]{
        return this.tasksEntries;
    }

    public setTasksEntries(entries: TaskEntry[]){
        this.tasksEntries = entries;
    }

    public getProjectsEntries():ProjectEntry[]{
        return this.projectsEntries;
    }

    public setProjectsEntries(entries: ProjectEntry[]){
        this.projectsEntries = entries;
    }
}

export class TaskEntry{

    private task: Task;
    private time: number;
    private intervals: number;

    public getTask():Task{
        return this.task;
    }

    public setTask(task:Task):void{
        this.task = task;
    }

    public getTime():number{
        return this.time;
    }

    public setTime(time:number){
        this.time = time;
    }

    public getIntervals():number{
        return this.intervals;
    }

    public setIntervals(intervals: number){
        this.intervals = intervals;
    }
}

export class ProjectEntry{

    private project: Project;
    private time: number;
    private intervals: number;

    public getProject():Project{
        return this.project;
    }

    public setProject(project:Project):void{
        this.project = project;
    }

    public getTime():number{
        return this.time;
    }

    public setTime(time:number):void{
        this.time = time;
    }

    public getIntervals():number{
        return this.intervals;
    }

    public setIntervals(intervals: number): void{
        this.intervals = intervals;
    }
}

export class TaskEntryCreator{

    public static create(history: PomodoroHistory[], dataService: DataService):Promise<TaskEntry[]>{
        const map = this.prepareMap(history);
        return this.createTasksEntries(map, dataService);
    }

    private static prepareMap(history:PomodoroHistory[]):Map<number, PomodoroHistory[]>{
        const map = new Map<number, PomodoroHistory[]>();
        history.forEach(entry=>{
            let taskId = entry.getTaskId();
            if(!taskId){
              taskId = -1;
            }
            if(taskId){
                if(!map.has(taskId)){
                    map.set(taskId, []);
                }
                map.get(taskId).push(entry);
            }
        });
        return map;
    }

    // TODO: obmyślić to jakoś inaczej
    private static createTasksEntries(map:Map<number, PomodoroHistory[]>, dataService: DataService):Promise<TaskEntry[]>{
        const result = [];
        const promises = [];
        map.forEach((list, taskId)=>{
          if(taskId>=0){
            const promise = dataService.getTaskService().getById(taskId).then(task=>{
                if(task){
                    const entry = this.createTaskEntry(task, list);
                    result.push(entry);
                }
            });
            promises.push(promise);
          } else {
            const task = new Task("Nieprzypisane");
            const entry = this.createTaskEntry(task, list);
            result.push(entry);
          }

        });
        return Promise.all(promises).then(()=>{
            return Promise.resolve(result);
        });
    }

    private static createTaskEntry(task:Task, list:PomodoroHistory[]){
        const entry = new TaskEntry();
        entry.setTask(task);
        entry.setTime(this.calculateTime(list));
        entry.setIntervals(this.calculateIntervals(list));
        return entry;
    }

    private static calculateTime(list:PomodoroHistory[]){
        let sumTime = 0;
        list.forEach(element=>sumTime+= element.getTime());
        return sumTime;
    }

    private static calculateIntervals(list:PomodoroHistory[]){
        return list.length;
    }
}

export class ProjectEntryCreator{

    public static create(history: PomodoroHistory[], dataService: DataService):Promise<ProjectEntry[]>{
        const map = this.prepareMap(history);
        return this.createProjectsEntries(map, dataService);
    }

    // TODO: wspólna metoda z TaskEntryCreator
    private static prepareMap(history:PomodoroHistory[]):Map<number, PomodoroHistory[]>{
        const map = new Map<number, PomodoroHistory[]>();
        history.forEach(entry=>{
            const projectId = entry.getProjectId();
            if(projectId){
                if(!map.has(projectId)){
                    map.set(projectId, []);
                }
                map.get(projectId).push(entry);
            }
        });
        return map;
    }

    private static createProjectsEntries(map:Map<number, PomodoroHistory[]>, dataService: DataService):Promise<ProjectEntry[]>{
        const result = [];
        const promises = [];

        map.forEach((list, projectId)=>{
            let promise = dataService.getProjectService().getById(projectId).then(project=>{
              if(project){
                let entry = this.createProjectEntry(project, list);
                result.push(entry);
              }
              return Promise.resolve(null);
            });
            promises.push(promise);
        });
        return Promise.all(promises).then(()=>{
            return Promise.resolve(result);
        });
    }

    private static createProjectEntry(project:Project, list:PomodoroHistory[]){
        const entry = new ProjectEntry();
        entry.setProject(project);
        entry.setTime(this.calculateTime(list));
        entry.setIntervals(this.calculateIntervals(list));
        return entry;
    }

    private static calculateTime(list:PomodoroHistory[]){
        let sumTime = 0;
        list.forEach(element=>sumTime+= element.getTime());
        return sumTime;
    }

    private static calculateIntervals(list:PomodoroHistory[]){
        return list.length;
    }

}
