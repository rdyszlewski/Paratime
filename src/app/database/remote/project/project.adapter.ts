import { Position } from "app/database/shared/models/orderable.item";
import { Project } from "app/database/shared/project/project";

export class ProjectAdapter{

  public static getProject(json): Project{
    let project = new Project();
    // project.setId(json["id"]);
    // project.setName(json["name"]);
    // project.setDescription(json["description"]);
    // project.setStartDate(json["startDate"]); // TODO: sprawdzić, czy to będzie dobrze działało
    // project.setEndDate(json["endDate"]);
    // project.setType(json["type"]);
    // project.setStatus(json["status"]);

    // // TODO: to usunąć jak zostanie wprowadzona nowe zarządzanie kolejnością
    // project.setSuccessorId(json["successor"]);
    // project.setPosition(json["head"] == 1 ? Position.HEAD: Position.NORMAL);

    return project;
  }
}
