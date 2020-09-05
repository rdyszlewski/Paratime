import { PomodoroHistory } from 'app/database/data/models/pomodoro.history';

export interface IPomodoroRepository{
    findById(id:number):Promise<PomodoroHistory>;
    findAll():Promise<PomodoroHistory[]>;
    findByTaskId(taskId:number):Promise<PomodoroHistory[]>;
    findByProjectId(projectId:number):Promise<PomodoroHistory[]>;
    findByDate(startDate:Date, endDate:Date):Promise<PomodoroHistory[]>;
    insert(entry: PomodoroHistory): Promise<number>;
    removeByTaskId(taskId:number):Promise<void>;
    removeByProject(projectId: number):Promise<void>;
    // TODO: pomyśleć, jak powinien działać system usuwania starych wspiów
    removeByDate(startDate:Date, endDate:Date):Promise<void>;
}
