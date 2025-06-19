import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'map',
  pure: false,
})
export class MapPipe implements PipeTransform {
  transform(value: Map<string, Record<string, any>>): any {
    return Array.from(value.values());
  }
}
