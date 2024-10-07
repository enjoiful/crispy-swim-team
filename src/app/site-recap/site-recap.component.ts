import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { FormsModule } from '@angular/forms';  // <-- Import FormsModule
import { environment } from '../../environments/environment';
import { BaseChartDirective } from 'ng2-charts';
import { SiteNamePipe } from '../site-name.pipe'; // Adjust the path as needed
import { SessionsService } from '../sessions.service'
import { SessionCardComponent } from '../session-card/session-card.component'
import { AllSitesComponent } from '../all-sites/all-sites.component'
import { Chart } from 'chart.js';
import { mergeMap, concatMap } from 'rxjs/operators';



import 'chartjs-plugin-datalabels'; // Import the plugin
import ChartDataLabels from 'chartjs-plugin-datalabels';


import { ActivatedRoute, Router, NavigationStart, NavigationEnd, NavigationError, Event } from '@angular/router';



@Component({
  selector: 'app-site-recap',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AllSitesComponent, RouterOutlet, CommonModule, FormsModule, BaseChartDirective, RouterLink, SiteNamePipe, SessionCardComponent],
  templateUrl: './site-recap.component.html',
  styleUrl: './site-recap.component.css',
  providers: [FirebaseService, SessionsService], // Ensure your service is properly injected

})
export class SiteRecapComponent implements OnInit {
  title = 'Crispy Swim Team';  // Added title property
  ChartDataLabels = ChartDataLabels
  allSessions: any[] = [];
  filteredSessions: any[] = [];
  selectedDate: string = '';  // Bound to the date input field
  chartOptions: any = {}
  barChartData: any = {}
  routeParams: any;



  constructor(private firebaseService: FirebaseService, private siteNamePipe: SiteNamePipe, private sessionsService: SessionsService, private route: ActivatedRoute, private router: Router) {
    initializeApp(environment.firebaseConfig);
  }

  ngOnInit() {
    // Set default date to yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 8);  // Subtract one day to get yesterday

    // Format the date as yyyy-MM-dd for the date input
    this.selectedDate = this.formatDateToInput(yesterday);
    this.loadAndFilterSessions(yesterday)


  }

  onDateChange() {
    const selectedDatePST = this.convertToPST(this.selectedDate);  // When a new date is selected, make sure it's interpreted as PST
    this.loadAndFilterSessions(selectedDatePST)
  }

  loadAndFilterSessions(selectedDate: Date) {

    this.firebaseService.getSessionsBetweenEpochs(this.epochStartInMilliseconds(new Date(selectedDate)), this.epochEndInMilliseconds(new Date(selectedDate))).pipe(
      concatMap((apiData: any) => {
        console.log('All sessions:', apiData);
        this.allSessions = apiData
        return this.route.queryParams;
      })
    ).subscribe(params => {
      console.log('Route parameters:', params);
      let siteId = Number(params['siteId'])
      if (siteId) {
        this.filteredSessions = this.allSessions.filter(session => session.spot.id == Number(siteId))
      } else {
        this.filteredSessions = this.allSessions;
      }
      console.log('filtered sessions', this.filteredSessions)
      this.sessionsService.updateData(this.filteredSessions);
      this.createChart(this.filteredSessions)
      this.processJumps(this.filteredSessions)
    });


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

  // Format date to yyyy-MM-dd for the date picker input field
  private formatDateToInput(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);  // Months are zero-indexed
    const day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  private epochStartInMilliseconds(date: Date) {
    const pstStartDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    pstStartDate.setHours(0, 0, 1, 0);  // Set to 12:00:01 AM PST
    return pstStartDate.getTime();
  }

  private epochEndInMilliseconds(date: Date) {
    const pstEndDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    pstEndDate.setHours(23, 59, 59, 999);  // Set to 11:59:59 PM PST
    return pstEndDate.getTime();
  }


  createChart(sessions: any) {
    // Count sessions per spot ID (existing code)
    var sessionCounts: any = {};
    sessions.forEach(function(session: any) {
      var spotId = session.spot.id;
      if (sessionCounts[spotId]) {
        sessionCounts[spotId]++;
      } else {
        sessionCounts[spotId] = 1;
      }
    });

    var _this = this
    // Convert sessionCounts object into an array of objects
    var sessionArray = Object.keys(sessionCounts).map(function(spotId) {
      return {
        spotId: _this.siteNamePipe.transform(spotId),
        count: sessionCounts[spotId]
      };
    });

    // Sort the array by count in descending order
    sessionArray.sort(function(a, b) {
      return b.count - a.count;
    });

    // Extract sorted labels and data arrays
    var labels = sessionArray.map(function(item) {
      return item.spotId;
    });

    var data = sessionArray.map(function(item) {
      return item.count;
    });

    // Create chart data object
    this.barChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Number of Sessions per Spot',
          data: data,
          borderWidth: 1,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)"
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)"
          ]
        }
      ]
    };

    this.chartOptions = {
      indexAxis: 'y',
      plugins: {
        title: {
          display: false,
          text: 'Sessions across Site'
        },
        tooltip: {
          enabled: true
        },
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Sessions'
          },
          grid: {
            display: false
          }
        },
        y: {
          title: {
            display: false,
            text: 'Spot ID'
          }
        }
      }
    }

  }

  masterArray: { rider: string, height: number }[] = [];
  riderColors: { [rider: string]: string } = {}; // Store colors per rider

  processJumps(sessions: any[]) {
    // Predefined colors for each rider
    this.masterArray = []
    const colors3 = ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'];
    const colors = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)"
    ];
    let colorIndex = 0;

    // Loop through each session
    sessions.forEach((session: any) => {
      if (session.jumps && session.jumps.length > 0) {
        // Assign a unique color to each rider
        if (!this.riderColors[session.user.name]) {
          this.riderColors[session.user.name] = colors[colorIndex % colors.length];
          colorIndex++;
        }

        // Sort jumps in descending order and get up to the top 3
        const topJumps = session.jumps
          .sort((a: any, b: any) => b.height - a.height)
          .slice(0, Math.min(3, session.jumps.length));

        // Push the top jumps to the masterArray
        topJumps.forEach((jump: any) => {
          this.masterArray.push({
            rider: session.user.name,
            height: jump.height
          });
        });
      }
    });

    // Sort masterArray by jump height in descending order
    this.masterArray.sort((a, b) => b.height - a.height);

    this.createJumpChart()
  }

  jumpBarChartData: any
  jumpBarChartOptions: any
  createJumpChart() {
    // const canvas = <HTMLCanvasElement>document.getElementById('jumpChart');
    // const ctx = canvas.getContext('2d');

    const labels = this.masterArray.map(jump => `${jump.rider}`).slice(0, 50);
    const data = this.masterArray.map(jump => jump.height).slice(0, 50);

    // Assign colors based on rider names
    const backgroundColors = this.masterArray.map(jump => this.riderColors[jump.rider]);


    // console.log('data is', data, labels)

    this.jumpBarChartData = {
      labels: labels,
      datasets: [{
        label: 'Top Jumps (m)',
        data: data,
        backgroundColor: backgroundColors, // Dynamic colors per bar
        // borderColor: '#ababab',

        // borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    }



    this.jumpBarChartOptions = {
      responsive: false,  // Disable responsiveness to prevent chart from adjusting to container size
      maintainAspectRatio: true, // Allow chart to grow vertically as needed
      indexAxis: 'y', // Horizontal bar chart
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            display: false
          }
        }

      },
      plugins: {
        datalabels: {
          anchor: 'end', // Position the labels at the end of the bars
          align: 'end', // Align labels to the bar
          color: '#000', // Label color (black)
          formatter: (value: any) => {
            return value.toFixed(1) + 'm'; // Format value (e.g., '10m')
          },
          font: {
            weight: '200' // Make label text bold
          }
        }
      }
    }
  }



}





    // // Call the getSessionsForUser method from FirebaseService and subscribe to its observable
    // this.firebaseService.getSessionsForUser(35609).subscribe({
    //   next: (sessions) => {
    //     // this.sessions = sessions;
    //     // this.createChart(sessions)
    //     // console.log('User Sessions:', this.sessions); // Debugging - log the retrieved sessions
    //   },
    //   error: (error) => {
    //     // this.errorMessage = `Error fetching user sessions: ${error}`;
    //     console.error(error);  // Log the error if something goes wrong
    //   }
    // });