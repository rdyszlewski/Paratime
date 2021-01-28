import { OrderableItem } from "app/database/shared/models/orderable.item";

export abstract class LocalDTO<T> {
  public abstract getModel():T;
  public abstract update(element: T);
}
