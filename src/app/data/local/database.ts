
import Dexie from 'dexie'
import { Task } from 'app/models/task';


export class LocalDatabase extends Dexie{

    // TODO: dodać wszystkie tabele

    private dbVersion = 1;
    private taskTable: Dexie.Table<Task, number>;

    constructor(){
        super("Database");
        
    }

    private createTables(){
        // TODO: tworzenie tabel
        this.version(this.dbVersion).stores({
            tasks: '++id, name, description, '
        });

        this.taskTable = this.table('tasks');
    }

}


// export class Task {
//     id: number;
//     name: string;
//     description: string;

//     public getId(){
//         return this.id;
//     }

//     public getName(){
//         return this.name;
//     }

//     public getDescription(){
//         return this.description;
//     }
// }