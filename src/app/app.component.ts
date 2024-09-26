import { Component, OnInit} from '@angular/core';
import { initializeApp } from 'firebase/app';
import { RouterOutlet } from '@angular/router';
import { FirebaseService } from './services/firebase.service';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { FormsModule } from '@angular/forms';  // <-- Import FormsModule
import { environment } from '../environments/environment';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [FirebaseService], // Ensure your service is properly injected

})
export class AppComponent implements OnInit {
  title = 'Session Tracker';  // Added title property
  sessions: any[] = [];
  selectedDate: string = '';  // Bound to the date input field

  constructor(private firebaseService: FirebaseService) {
    initializeApp(environment.firebaseConfig);
  }  // Updated to FirebaseService

  ngOnInit() {
    // Set default date to yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);  // Subtract one day to get yesterday

    // Format the date as yyyy-MM-dd for the date input
    this.selectedDate = this.formatDateToInput(yesterday);


    // Fetch sessions for yesterday's date
    this.fetchSessionsForDate(yesterday);
  }

    // Format date to yyyy-MM-dd for the date picker input field
    private formatDateToInput(date: Date): string {
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);  // Months are zero-indexed
      const day = ('0' + date.getDate()).slice(-2);
  
      return `${year}-${month}-${day}`;
    }
  

  // When a new date is selected, make sure it's interpreted as PST
  onDateChange() {
    // Convert the selected date (from date picker) to PST
    const selectedDatePST = this.convertToPST(this.selectedDate);
    this.fetchSessionsForDate(selectedDatePST);
  }

  // Convert the date from the date picker to PST (America/Los_Angeles time zone)
  private convertToPST(dateString: string): Date {
    // Parse the date string (yyyy-mm-dd) and convert it to a PST date object
    const dateParts = dateString.split('-');
    const selectedDate = new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[2]);  // Create date from picker value

    // Convert this date to PST
    const pstDate = new Date(selectedDate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    return pstDate;
  }

  // Set the date to the start of the day in PST (12:00:01 AM PST)
  private setToStartOfDayInPST(date: Date) {
    const pstStartDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    pstStartDate.setHours(0, 0, 1, 0);  // Set to 12:00:01 AM PST
    return pstStartDate;
  }

  // Set the date to the end of the day in PST (11:59:59 PM PST)
  private setToEndOfDayInPST(date: Date) {
    const pstEndDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    pstEndDate.setHours(23, 59, 59, 999);  // Set to 11:59:59 PM PST
    return pstEndDate;
  }

  // Fetch sessions between the start and end of the selected date in PST
  fetchSessionsForDate(date: Date) {
    // Get the start and end times in PST
    const startDate = this.setToStartOfDayInPST(new Date(date));
    const endDate = this.setToEndOfDayInPST(new Date(date));

    const startEpochInMilliseconds = startDate.getTime();  // Start of day (12:00:01 AM PST)
    const endEpochInMilliseconds = endDate.getTime();  // End of day (11:59:59 PM PST)

    console.log('Start Epoch (PST):', startEpochInMilliseconds);
    console.log('End Epoch (PST):', endEpochInMilliseconds);

    // Call the service with the start and end epoch to fetch sessions in between
    this.firebaseService.getSessionsBetweenEpochs(startEpochInMilliseconds, endEpochInMilliseconds)
      .subscribe(data => {
        this.sessions = data;
      });
  }
}