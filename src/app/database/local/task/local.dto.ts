import { OrderableItem } from "app/database/shared/models/orderable.item";

export abstract class LocalDTO<T> extends OrderableItem{
  public abstract getModel():T;
}
