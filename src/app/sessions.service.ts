import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {
  // Initialize the BehaviorSubject with a default value
  private dataSubject = new BehaviorSubject<any>(null);

  // Expose the observable part of the subject (read-only)
  public data$: Observable<any> = this.dataSubject.asObservable();

  // Method to update the value in the observable
  updateData(newData: any): void {
    this.dataSubject.next(newData);
  }
}