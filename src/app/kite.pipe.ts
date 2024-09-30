import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kite',
  standalone: true
})
export class KitePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    // Remove any content within parentheses, including the parentheses
    value = value.replace(/\(.*?\)/g, '').trim();

    // Split the string by '|'
    const parts = value.split('|').map(part => part.trim());

    if (parts.length < 3) return value;

    // Convert the model to uppercase and get the size
    const model = parts[0].toUpperCase();
    const size = parts[2];

    // Return the formatted string
    return `${model} ${size}`;
  }

}
