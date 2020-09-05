import { KeyCode } from './key_codes';
import { KeyHandler } from './keys/key_handler';

export class EditInputHandler{

    public static handleKeyEvent(event:KeyboardEvent, onEnter: ()=>void, onEsc: ()=>void){
        const funcMap = new Map<number, ()=>void>([
            [KeyCode.ENTER, onEnter],
            [KeyCode.ESC, onEsc]
        ]);
        KeyHandler.handle(event, funcMap);
    }
}