import { IDraggingController } from '../../day-schedule/tasks-list/draggine-controller';

type Callback = (dragged:string, dropped:string)=>void;

export class CellDraging implements IDraggingController{
  private readonly DRAGGING_CLASS = 'dragging';
  private readonly LOOKING_CLASS = 'cell-info';
  private readonly DROPPABLE_CONTAINER = 'day-handler';
  private _currentDraggingTarget: HTMLElement;
  private _draggedElement: HTMLElement;
  private _callback: Callback;

  constructor(callback: Callback){
    this._callback = callback;
  }

  public onDragStart(event: DragEvent){
    const element = event.target as HTMLElement;
    this._draggedElement = element;
  }

  public handleDragLeave(event:DragEvent){
    event.preventDefault();
    if(this._currentDraggingTarget){
      this._currentDraggingTarget.parentElement.classList.remove(this.DRAGGING_CLASS);
      this._currentDraggingTarget = null;
    }
    return true;
  }

  public onDrop(event:DragEvent){
    event.preventDefault();
    event.stopPropagation();
    this.deselectCell(this._currentDraggingTarget);
    if(this._currentDraggingTarget){
      this._callback(this._draggedElement.id, this._currentDraggingTarget.id);
    }
  }

  public allowDrop(event:DragEvent){
    event.preventDefault();
    let target = event.target as HTMLElement;
    let element = this.getElement(target);

    if(this.isChangedTarget(element)){
      this.deselectCell(this._currentDraggingTarget);
    }
    this.selectCell(element);
    this._currentDraggingTarget = element;
    event.stopPropagation();
    return true;
  }

  private getElement(target: HTMLElement) {
    let element;
    if (target.classList.contains(this.LOOKING_CLASS)) {
      element = target.parentElement;
    } else if (target.classList.contains(this.DROPPABLE_CONTAINER)) {
      element = target;
    }
    return element;
  }

  private isChangedTarget(parent: HTMLElement) {
    return this._currentDraggingTarget && this._currentDraggingTarget != parent;
  }

  private selectCell(element: HTMLElement){
    if(element){
      element.parentElement.classList.add(this.DRAGGING_CLASS);
    }
  }

  private deselectCell(element: HTMLElement){
    if(element){
      element.parentElement.classList.remove(this.DRAGGING_CLASS);
    }
  }
}
