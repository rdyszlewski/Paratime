import { Project } from 'app/models/project';
import { StoreManager } from '../common/store_manager';
import { LocalDataSource } from '../local/source';
import { Status } from 'app/models/status';
import { Task } from 'app/models/task';

export class DatabaseTest{

    private storeManager: StoreManager;

    constructor(){
        let dataSource = new LocalDataSource();
        this.storeManager = new StoreManager(dataSource);
    }

    public addProject(): Promise<Project>{
        let project = this.createProject();
        return this.insertProject(project);
    }

    private insertProject(project: Project): Promise<Project> {
        console.log("Inserting project");
        return this.storeManager.getProjectStore().createProject(project).then(inserted_project => {
            console.log(inserted_project);
            return Promise.resolve(inserted_project);
        });
    }

    private createProject() {
        return this.createProjectWithName("Projekt 1");
    }

    private createProjectWithName(name:string){
        let project = new Project();
        project.setName(name);
        project.setDescription("To jest projekt " + name);
        project.setStatus(Status.AWAITING);
        return project;
    }

    public updateProject(): Promise<Project>{
        let project = this.createProject();
        return this.insertProject(project).then(result=>{
            result.setName("Zaktualizowany projekt");
            return this.storeManager.getProjectStore().updateProject(project).then(updatedProject=>{
                console.log("Zaktualizowany projekt");
                console.log(updatedProject);
                return Promise.resolve(updatedProject);
            });
        });
    }

    public removeProject():Promise<void>{
        let project = this.createProject();
        return this.insertProject(project).then(insertedProject=>{
            return this.storeManager.getProjectStore().removeProject(insertedProject.getId()).then(()=>{
                return this.storeManager.getProjectStore().getProjectById(insertedProject.getId()).then(result=>{
                    console.log("Pozostałe zadanie");
                    console.log(result);
                });
            });
        })
    }

    public addTasksToProject():Promise<Project>{
        let project = this.createProject();
        let task1 = this.createTask("Zadanie 1");
        let task2 = this.createTask("Zadanie 2");
        return this.insertProject(project).then(project=>{
            this.insertTasks(task1, task2, project);
        }).then(()=>{
            return Promise.resolve(project);
        });
    }

    private insertTasks(task1: Task, task2: Task, project: Project): Promise<Project> {
        task1.setProject(project);
        task2.setProject(project);
        console.log("Dodawanie zadań");
        console.log(task1.getProjectID());
        console.log(task2.getProjectID());
        return this.storeManager.getTaskStore().createTask(task1).then(result => {
            console.log("Wstawiono zadanie");
            console.log(result);
        }).then(task1Result => {
            return this.storeManager.getTaskStore().createTask(task2).then(result => {
                console.log("Wstawiono zadanie");
                console.log(result);
            }).then(() => {
                return this.storeManager.getTaskStore().getTaskById(1).then(result => {
                    console.log("Zadanie nr 1");
                    console.log(result);
                    return Promise.resolve(project);
                });
            });
        });
    }

    private createTask(name:string){
        let task = new Task();
        task.setName(name);
        task.setDescription("To jest zadanie " + name);
        task.setStatus(Status.AWAITING);
        return task;
    }

    public removeTask(){
        let project = this.createProject();
        let task1 = this.createTask("Zadanie 1");
        let task2 = this.createTask("Zadanie 2");
        return this.insertProject(project).then(project=>{
            return this.insertTasks(task1, task2, project).then(()=>{
                return this.storeManager.getTaskStore().removeTask(1).then(()=>{
                    return this.storeManager.getTaskStore().getTaskById(1).then(result=>{
                        console.log("Po usunięciu zadania");
                        console.log(result);
                    })
                })
            });
        }).then(()=>{
            return Promise.resolve(project);
        });
    }

    public removeAllProject(){
       
        let project = this.createProject();
        let task1 = this.createTask("Zadanie 1");
        let task2 = this.createTask("Zadanie 2");
        return this.insertProject(project).then(project=>{
            return this.insertTasks(task1, task2, project).then(()=>{
                return this.storeManager.getProjectStore().removeProject(project.getId()).then(()=>{
                    return this.storeManager.getTaskStore().getTaskById(1).then(result=>{
                        console.log("Zadanie po usunięciu projektu");
                        console.log(result);
                    });
                }).then(()=>{
                    return this.storeManager.getProjectStore().getProjectById(1).then(result=>{
                        console.log("Projekt po usunięciu");
                        console.log(result);
                    });
                });
            });
        });
    }

    public getAllProjects(){
        let project1 = this.createProjectWithName("Projekt 1");
        let project2 = this.createProjectWithName("Projekt 2");
        let project3 = this.createProjectWithName("Projekt 3");

        return this.storeManager.getProjectStore().createProject(project1).then(project=>{
            return this.storeManager.getProjectStore().createProject(project2).then(project=>{
                return this.storeManager.getProjectStore().createProject(project3).then(project=>{
                    return this.storeManager.getProjectStore().getAllProjects().then(projects=>{
                        console.log("Lista projekty");
                        console.log(projects);
                    })
                })
            })
        })
    }

}