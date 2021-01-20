import { OrderableItem } from 'app/database/shared/models/orderable.item';

export class TaskItemOrderer <T extends OrderableItem>{

    public getSortedItems(items:T[]){
        if(items.length == 0){
            return [];
        }
        return this.order(items);
    }

    private order(items: T[]) {
        const orderedItems = [];
        const itemsMap = this.getItemsMap(items);
        let currentItem = this.findFirstItem(items);
        if(!currentItem){
          return orderedItems;
        }
        let lastItemId = currentItem.id;
        while(currentItem!=null){
          orderedItems.push(currentItem);
          currentItem = itemsMap.get(currentItem.successorId);
          if(currentItem){
            if(currentItem.id == lastItemId){
              return orderedItems;
            } else {
              lastItemId = currentItem.id;
            }
          }
        }
        return orderedItems;
    }

    private getItemsMap(items:T[]):Map<number, T>{
      const map = new Map<number, T>();
      items.forEach(item=>{
        map.set(item.id, item);
      });
      return map;
    }

    private findFirstItem(items: T[]){
      return items.find(item=>item.isHead());
    }

}
