import { TaskEntry } from '../model';

export class TaskDataSorter{

    // TODO: sortowanie powinno być przeniesione na stronę serwera
   // TODO: poprawić całe to sortowanie
    public static sort(field:string, direction: string, entries:TaskEntry[]):TaskEntry[]{
        switch(field){
             case "name":
                return this.sortByName(direction, entries);
             case "time":
                 return this.sortByTime(direction, entries);
             case "intervals":
                 return this.sortByIntervals(direction, entries);
        }
    }

    private static sortByName(direction, entries:TaskEntry[]){
         if(direction == "asc"){
             return entries.sort((a,b)=>(a.getTask().name>b.getTask().name)? 1: -1);
         } else {
             return entries.sort((a,b)=>(a.getTask().name>b.getTask().name)? -1: 1);
         }
    }

    private static sortByTime(direction, entries:TaskEntry[]){
         if(direction == "asc"){
             return entries.sort((a,b)=>(a.getTime() > b.getTime())? 1: -1);
         } else {
             return entries.sort((a,b)=>(a.getTime() > b.getTime())? -1: 1);
         }
    }

    private static sortByIntervals(direction, entries:TaskEntry[]){
     if(direction == "asc"){
         return entries.sort((a,b)=>(a.getIntervals() > b.getIntervals())? 1: -1);
     } else {
         return entries.sort((a,b)=>(a.getIntervals() > b.getIntervals())? -1: 1);
     }
    }

}
