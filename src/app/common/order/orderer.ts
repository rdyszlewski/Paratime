import { OrderableItem } from 'app/data/models/orderable.item';

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
        let lastItemId = currentItem.getId();
        while(currentItem!=null){
          orderedItems.push(currentItem);
          currentItem = itemsMap.get(currentItem.getSuccessorId());
          if(currentItem){
            if(currentItem.getId() == lastItemId){
              return orderedItems;
            } else {
              lastItemId = currentItem.getId();
            }
          }
        }
        return orderedItems;
    }

    private getItemsMap(items:T[]):Map<number, T>{
      const map = new Map<number, T>();
      items.forEach(item=>{
        map.set(item.getId(), item);
      });
      return map;
    }

    private findFirstItem(items: T[]){
      return items.find(item=>item.isHead());
    }

}
