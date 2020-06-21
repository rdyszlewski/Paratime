
export class TaskTagsModel{

    private taskId: number;
    private tagId: number;

    constructor(taskId: number, tagId:number){
        this.taskId = taskId;
        this.tagId = tagId;
    }

    public getTaskId(){
        return this.taskId;
    }

    public setTaskId(id: number){
        this.taskId = id;
    }

    public getTagId(){
        return this.tagId;
    }

    public setTagId(id: number){
        this.tagId = id;
    }
}