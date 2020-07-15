import { DataService } from 'app/data.service';

export class ProjectsLoader{

    public static loadProjectsFromStore(){
        return DataService.getStoreManager().getProjectStore().getAllProjects();
      }
}