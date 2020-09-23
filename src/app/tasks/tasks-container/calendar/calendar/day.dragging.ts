type Callback = (dragged:string, dropped:string)=>void;

export class CellDraging{
  private readonly DRAGGING_CLASS = 'dragging';
  private readonly LOOKING_CLASS = 'day-number';
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

    if(target.classList.contains(this.LOOKING_CLASS)){
      const parent = target.parentElement;
      if(this.isChangedTarget(parent)){
        this.deselectCell(this._currentDraggingTarget);
      }
      this.selectCell(parent);
      this._currentDraggingTarget = parent;
      event.stopPropagation();
    }
    return true;
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
