import { ComponentRef } from '@angular/core';

export class ComponentLRUCache {
  private maxSize: number = 10;
  private map: Map<number, ComponentRef<any>>;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
    this.map = new Map<number, ComponentRef<any>>();
  }

  get(index: number) {
    const item = this.map.get(index);
    if (item instanceof ComponentRef) {
      this.map.delete(index);
      this.map.set(index, item);
    }
    return item;
  }

  set(index: number, item: ComponentRef<any>) {
    if (this.map.has(index)) {
      this.map.delete(index);
    } else if (this.map.size >= this.maxSize) {
      const oldestKey = this.map.keys().next().value;
      const oldestValue = this.map.get(oldestKey);
      if (oldestValue instanceof ComponentRef) {
        oldestValue.destroy();
        this.map.delete(index);
      }

      this.map.set(index, item);
    }
  }

  has(index: number) {
    return this.map.has(index);
  }

  remove(index: number) {
    const ref = this.map.get(index);
    if (ref instanceof ComponentRef) {
      ref.destroy();
      this.map.delete(index);
    }
  }
}
