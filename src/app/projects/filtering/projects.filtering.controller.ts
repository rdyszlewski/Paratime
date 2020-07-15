import { ProjectFilterModel } from './filter_model';
import { ProjectsLoader } from '../common/projects.loader';
import { ProjectsModel } from '../common/model';

export class ProjectsFilteringController{

    private model: ProjectFilterModel = new ProjectFilterModel();
    private listModel: ProjectsModel;

    constructor(listModel: ProjectsModel){
        this.listModel = listModel;
    }

    public getModel():ProjectFilterModel{
        return this.model;
    }

    public clearFilter(){
        this.model.clear();
        this.searchFilter();
    }

    public searchFilter(){
        // TODO: spróbować to zrobić na bazie danych
        ProjectsLoader.loadProjectsFromStore().then(projects=>{
            let resultFilter = projects;
            if(this.model.isWithEndDate()){
            resultFilter = resultFilter.filter(x=>x.getEndDate()!=null);
            }
            if(this.model.getStatus() != null){
            resultFilter = resultFilter.filter(x=>x.getStatus()==this.model.getStatus());
            }
            if(this.model.getProjectType() != null){
            resultFilter = resultFilter.filter(x=>x.getType()==this.model.getProjectType());
            }
            this.listModel.setProjects(resultFilter);
        });
    }  
}    