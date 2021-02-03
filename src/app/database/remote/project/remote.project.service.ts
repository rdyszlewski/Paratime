import { HttpClient } from "@angular/common/http";
import { Project } from "app/database/shared/project/project";
import { ProjectFilter } from "app/database/shared/project/project.filter";
import { ProjectInsertResult } from "app/database/shared/project/project.insert-result";
import { IProjectService } from "app/database/shared/project/project.service";
import { ProjectsComponent } from "app/tasks/lists-container/projects/projects.component";
import { map } from "rxjs/operators";
import { ProjectAdapter } from "./project.adapter";

export class RemoteProjectService implements IProjectService{

  private readonly SERVICE_PATH = "projects";
  private _serviceUrl: string;

  constructor(private _httpClient: HttpClient, url: string){
    this._serviceUrl = url  + this.SERVICE_PATH;
  }

  getById(id: number): Promise<Project> {
    throw new Error("Method not implemented.");
  }

  getByName(name: string): Promise<Project[]> {
    throw new Error("Method not implemented.");
  }

  getByFilter(filter: ProjectFilter): Promise<Project[]> {
    throw new Error("Method not implemented.");
  }

  getAll(): Promise<Project[]> {
    return this._httpClient.get<Project[]>(this._serviceUrl).toPromise().then(result=>{
      console.log("Wynik");

      console.log(result);
      // let projects = result.map(x=>ProjectAdapter.getProject(x));
      let projects = result;
      console.log(projects);

      return Promise.resolve(projects);
    });
  }

  create(project: Project): Promise<ProjectInsertResult> {
    console.log(JSON.stringify(project));
    return this._httpClient.post<JSON>(this._serviceUrl, project).pipe(map(response=>{
      // TODo: to będzie trzeba pewnie zrobić inaczej
      console.log(response);

    })).toPromise().then(result=>{
      return Promise.resolve(new ProjectInsertResult(project));
    });
  }

  remove(project: Project): Promise<Project[]> {
    throw new Error("Method not implemented.");
  }

  update(project: Project): Promise<Project> {
    throw new Error("Method not implemented.");
  }

  changeOrder(currentProject: Project, previousProject: Project, currentIndex: number, previousIndex: number): Promise<Project[]> {
    throw new Error("Method not implemented.");
  }
}
