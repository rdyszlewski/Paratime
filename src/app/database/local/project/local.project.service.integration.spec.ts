import { DataService } from "app/data.service";
import { Status } from "app/database/shared/models/status";
import { Project } from "app/database/shared/project/project";
import { ProjectType } from "app/database/shared/project/project_type";
import { LocalDatabase } from "../database";
import { LocalDataSource } from "../local.source";

describe("LocalProjectService", () => {
  let database: LocalDatabase;
  let dataService: DataService;
  beforeEach(() =>{
    database = new LocalDatabase("TestDb");
    let source = new LocalDataSource(database);
    dataService = new DataService(source);
  });
  afterEach(() =>{
    database.delete().then(result=>{
      console.log("Database closed");

    });
    // TODO: tutaj może będzie trzeba zrobić jakieś czyszczenie
  });
  it("shoud create project", (done) => {
    const name = "One";
    const description = "This is project 1";
    const status = Status.CANCELED;
    const type = ProjectType.MEDIUM;
    let project = new Project(name, description, status, type);
    dataService.getProjectService().create(project).then(insertResult=>{
      // TODO: dlaczego tutaj nie ma insertedElement ?
      let insertedProject = insertResult.insertedProject;
      expect(insertResult.insertedProject.id).toBeTruthy();
      dataService.getProjectService().getAll().then(projects=>{
        expect(projects.length).toEqual(1);
        let project = projects[0];
        expect(project.id).toEqual(insertedProject.id);
        expect(project.name).toEqual(name);
        expect(project.description).toEqual(description);
        expect(project.status).toEqual(status);
        expect(project.type).toEqual(type);
      })
      done();
    });
  });

});
