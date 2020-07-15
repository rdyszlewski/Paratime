import { SpecialList } from 'app/projects/common/special_list';
import { DataService } from 'app/data.service';
import { Project } from 'app/models/project';
import { TasksModel } from '../model';

export class SpecialListTaks{

    private IMPORTANT_NAME = "Ważne";
    private TODAY_NAME = "Dzisiaj";

    private model: TasksModel;

    constructor(model:TasksModel){
        this.model = model;
    }

    public setSpecialList(listType: SpecialList){
        switch(listType){
          case SpecialList.IMPORTANT:
            this.loadImportantTasks();
            break;
          case SpecialList.TODAY:
            this.loadTodayTasks();
            break;
        }
      }
    
      private loadImportantTasks(){
        DataService.getStoreManager().getTaskStore().getImportantTasks().then(tasks=>{
          let project = new Project(this.IMPORTANT_NAME);
          project.setTasks(tasks);
          this.model.setProject(project);
          // TODO: sprawdzić to, czy wszysto jest ok
        });
      }
    
      private loadTodayTasks(){
        DataService.getStoreManager().getTaskStore().getTasksByDate(new Date()).then(tasks=>{
          let project = new Project(this.TODAY_NAME);
          project.setTasks(tasks);
          this.model.setProject(project);
        });
      }
}