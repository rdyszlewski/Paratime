import { IPomodoroRepository } from '../repositories/pomodoro_repository';
import { PomodoroHistory } from 'app/database/data/models/pomodoro.history';

export class PomodoroStore{

    private pomodoroRepository: IPomodoroRepository;

    constructor(pomodoroRepository: IPomodoroRepository){
        this.pomodoroRepository = pomodoroRepository;
    }

    public getAll():Promise<PomodoroHistory[]>{
        return this.pomodoroRepository.findAll();
    }

    public getByTaskId(taskId:number):Promise<PomodoroHistory[]>{
        return this.pomodoroRepository.findByTaskId(taskId);
    }

    public getByProjectId(projectId:number): Promise<PomodoroHistory[]>{
        return this.pomodoroRepository.findByProjectId(projectId);
    }

    public getByDate(startDate:Date, endDate:Date):Promise<PomodoroHistory[]>{
        return this.pomodoroRepository.findByDate(startDate, endDate);
    }

    public create(entry:PomodoroHistory): Promise<PomodoroHistory>{
        return this.pomodoroRepository.insert(entry).then(insertedId=>{
            return this.pomodoroRepository.findById(insertedId);
        });
    }

    public removeByTaskId(taskId:number):Promise<void>{
        return this.pomodoroRepository.removeByTaskId(taskId);
    }

    public removeByProjectId(projectId: number):Promise<void>{
        return this.pomodoroRepository.removeByProject(projectId);
    }

    public removeByDate(startDate:Date, endDate:Date):Promise<void>{
        return this.pomodoroRepository.removeByDate(startDate, endDate);
    }
}
