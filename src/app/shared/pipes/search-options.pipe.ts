import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchOptions',
})
export class SearchOptionsPipe implements PipeTransform {
  transform(items: any[], filter: string): any {
    if (!items || !filter) {
      return items;
    }

    // This will search and match any option.value that contains the search term
    const filteredItems = items?.filter(
      (item) =>
        item?.label
          ?.toString()
          ?.toLowerCase()
          ?.startsWith(filter?.toLowerCase()) ||
        item?.value
          ?.toString()
          ?.toLowerCase()
          ?.startsWith(filter?.toLowerCase()) ||
        item?.display
          ?.toString()
          ?.toLowerCase()
          ?.startsWith(filter?.toLowerCase()),
    );
    if (filteredItems.length === 0) {
      return [{ label: 'No data found', value: null, disabled: true }];
    }

    return filteredItems;
  }
}
