import { SpecialList } from 'app/projects/common/special_list';
import { DataService } from 'app/data.service';
import { Project } from 'app/models/project';
import { TasksModel } from '../model';
import { Values } from 'app/common/values';

export class SpecialListTasks{

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
          project.setId(Values.SPECIAL_LIST_ID); // TODO: przenieść do stałej
          project.setTasks(tasks);
          this.model.setProject(project);
          this.model.setTasks(tasks);
          // TODO: sprawdzić to, czy wszysto jest ok
        });
      }

      private loadTodayTasks(){
        DataService.getStoreManager().getTaskStore().getTasksByDate(new Date()).then(tasks=>{
          let project = new Project(this.TODAY_NAME);
          project.setTasks(tasks);
          project.setId(Values.SPECIAL_LIST_ID); // TODo: przenieść do stałej
          this.model.setProject(project);
          this.model.setTasks(tasks);
        });
      }
}
