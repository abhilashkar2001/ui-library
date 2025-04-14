import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tenureFormat' })
export class TenureFormatPipe implements PipeTransform {
  transform(years: number, months: number, days: number): string {
    const parts = [];
    if (years) parts.push(`${years} year${years > 1 ? 's' : ''}`);
    if (months) parts.push(`${months} month${months > 1 ? 's' : ''}`);
    if (days) parts.push(`${days} day${days > 1 ? 's' : ''}`);
    return parts.length ? parts.join(' ') : '0 days';
  }
}
