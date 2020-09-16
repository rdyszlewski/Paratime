export class DateAdapter{

  public static getDate(date:string){
    if(!date){
      return null;
    }
    const dateParts = date.split("-");
    return new Date(Number.parseInt(dateParts[0], Number.parseInt(dateParts[1],Number.parseInt(dateParts[2]))));
  }

  public static getText(date: Date){
    if(!date){
      return null;
    } else {
      return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
    }
  }
}
