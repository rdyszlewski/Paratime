export interface IDraggingController{
  onDragStart(event: DragEvent);
  handleDragLeave(event: DragEvent);
  onDrop(event: DragEvent);
  allowDrop(event: DragEvent);
}
