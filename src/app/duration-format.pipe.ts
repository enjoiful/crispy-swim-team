import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationFormat',
  standalone: true
})
export class DurationFormatPipe implements PipeTransform {
  transform(totalSeconds: number, hoursOrMinutes: string): number {
    if (isNaN(totalSeconds) || totalSeconds < 0) {
      return 0;
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hoursOrMinutes === 'hours'){
      return hours
    } else if (hoursOrMinutes === 'minutes'){
      return minutes
    } else {
      return 0
    }

    // let formattedDuration = '';

    // if (hours > 0) {
    //   formattedDuration += `${hours}h`;
    // }

    // if (minutes > 0 || hours === 0) {
    //   formattedDuration += `${minutes}m`;
    // }

    // return formattedDuration;
  }
}