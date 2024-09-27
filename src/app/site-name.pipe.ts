import { Pipe, PipeTransform, Injectable} from '@angular/core';
import * as sitesData from '../assets/sites.json';
const sites: { [key: string]: any } = sitesData;

@Pipe({
  name: 'siteName',
  standalone: true
})

@Injectable({
  providedIn: 'root' // This makes the pipe injectable and available application-wide
})

export class SiteNamePipe implements PipeTransform {

  transform(id: number | string): string {
    if (!id) {
      return '';
    }

    const idStr = id.toString();
    const site = sites[idStr];

    return site ? site.name : 'Unknown Location';
  }
}