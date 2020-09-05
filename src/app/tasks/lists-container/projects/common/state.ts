export class ProjectsViewState{

    private addingProjectOpen: boolean;
    private filterOpen:boolean;
    private specialListOpen: boolean = false;;
    private projectsListOpen: boolean = true;

    public isAddingOpen(){
        return this.addingProjectOpen;
    }    

    public openAddingProject(){
        this.addingProjectOpen = true;
    }

    public closeAddingProject(){
        this.addingProjectOpen = false;
    }

    public isFilteringOpen():boolean{
        return this.filterOpen;
    }

    public openFiltering(){
        this.filterOpen = true;
    }

    public closeFiltering(){
        this.filterOpen = false;
    }

    public toggleFilteringOpen(){
        this.filterOpen = !this.filterOpen;
    }

    public isSpecialListOpen(){
        return this.specialListOpen;
    }

    public openSpecialList(){
        this.specialListOpen = true;
    }

    public closeSpecialList(){
        this.specialListOpen = false;
    }

    public toggleSpecialListOpen(){
        this.specialListOpen = !this.specialListOpen;
    }

    public isProjectsListOpen():boolean{
        return this.projectsListOpen;
    }

    public openProjectsList(){
        this.projectsListOpen = true;
    }

    public closeProjectsList(){
        this.projectsListOpen = false;
    }

    public toggleProjectsListOpen(){
        this.projectsListOpen = !this.projectsListOpen;
    }
}