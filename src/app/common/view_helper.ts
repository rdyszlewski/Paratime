import * as $ from 'jquery';
export class FocusHelper{

    public static focus(elementName:string){
        setTimeout(()=>{
            $(elementName).focus();
        },0); 
    }
}

export class ScrollBarHelper{

    public static moveToBottom(elementName:string){
        let scrollContainer = $("#projects-list");
        setTimeout(()=>{
          scrollContainer.animate({ scrollTop: $(document).height() }, 1000);;
        },0);
    }
}