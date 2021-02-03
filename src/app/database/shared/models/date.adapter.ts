export class DateAdapter{

  public static getDate(date:string){
    if(!date){
      return null;
    }
    const dateParts = date.split("-");
    let year = Number.parseInt(dateParts[0]);
    let month = Number.parseInt(dateParts[1]);
    let day = Number.parseInt(dateParts[2]);
    return new Date(year, month, day);
  }

  public static getText(date: Date){
    if(!date){
      return null;
    } else {
      const dateText = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
      console.log(dateText);
      return dateText;
    }
  }
}
