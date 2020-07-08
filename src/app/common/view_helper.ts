import * as $ from 'jquery';
export class FocusHelper{

    public static focus(elementName:string){
        setTimeout(()=>{
            $('#subtask').focus();
          },0); 
    }
}