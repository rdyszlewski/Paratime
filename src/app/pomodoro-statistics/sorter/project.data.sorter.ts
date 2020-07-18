import { ProjectEntry } from '../model';

export class ProjectDataSorter{

    
    // TODO: sortowanie powinno być przeniesione na stronę serwera
   // TODO: poprawić całe to sortowanie
   public static sort(field:string, direction: string, entries:ProjectEntry[]):ProjectEntry[]{
        switch(field){
            case "name":
                return this.sortByName(direction, entries);
            case "time":
                return this.sortByTime(direction, entries);
            case "intervals":
                return this.sortByIntervals(direction, entries);
        }
    }

    private static sortByName(direction, entries:ProjectEntry[]){
        if(direction == "asc"){
            return entries.sort((a,b)=>(a.getProject().getName()>b.getProject().getName())? 1: -1);
        } else {
            return entries.sort((a,b)=>(a.getProject().getName()>b.getProject().getName())? -1: 1);
        }
    }

    private static sortByTime(direction, entries:ProjectEntry[]){
        if(direction == "asc"){
            return entries.sort((a,b)=>(a.getTime() > b.getTime())? 1: -1);
        } else {
            return entries.sort((a,b)=>(a.getTime() > b.getTime())? -1: 1);
        }
    }

    private static sortByIntervals(direction, entries:ProjectEntry[]){
        if(direction == "asc"){
            return entries.sort((a,b)=>(a.getIntervals() > b.getIntervals())? 1: -1);
        } else {
            return entries.sort((a,b)=>(a.getIntervals() > b.getIntervals())? -1: 1);
        }
    }

}