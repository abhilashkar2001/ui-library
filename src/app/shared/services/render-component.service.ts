import {
  ComponentRef,
  Injectable,
  Type,
  ViewContainerRef,
} from '@angular/core';

/**
 * A service for dynamically loading Angular components into a `ViewContainerRef`.
 */
@Injectable({
  providedIn: 'root',
})
export class RenderComponentService {
  /**
   * Dynamically loads a component into the provided `ViewContainerRef`.
   * It clears the container before inserting the new component.
   *
   * @template T - The type of the component to be loaded.
   * @param {ViewContainerRef} viewContainerRef - The container where the component should be inserted.
   * @param {Type<T>} component - The component type to load.
   * @returns {ComponentRef<T>} - A reference to the created component instance.
   */
  loadComponent<T>(
    viewContainerRef: ViewContainerRef,
    component: Type<T>,
  ): ComponentRef<T> {
    viewContainerRef.clear();
    return viewContainerRef.createComponent(component);
  }
}
