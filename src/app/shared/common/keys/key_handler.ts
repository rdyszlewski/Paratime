export class KeyHandler{
    
    public static handle(event:KeyboardEvent,map:Map<number,()=>void>){
        const func = map.get(event.keyCode);
        if(func){
          func();
        }
    }
}