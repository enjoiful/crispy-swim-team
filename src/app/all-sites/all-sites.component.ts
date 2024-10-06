import 'chartjs-adapter-date-fns';
import { Component, Input, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, map } from 'rxjs'
import { DashboardCardComponent } from "../dashboard-card/dashboard-card.component";
import { SessionsService } from '../sessions.service'
import { ChartData, ChartOptions, Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { toZonedTime } from 'date-fns-tz';
import { SiteNamePipe } from '../site-name.pipe'
import { Filler } from 'chart.js';


@Component({
  selector: 'app-all-sites',
  standalone: true,
  imports: [DashboardCardComponent, BaseChartDirective],
  templateUrl: './all-sites.component.html',
  styleUrl: './all-sites.component.css'
})
export class AllSitesComponent {
  sessions: any[] = []
  siteCount: number = 0;
  kiterCount: number = 0;
  totalTime: string = ''
  totalJumps: number = 0;
  state$: Observable<object>
  constructor(public activatedRoute: ActivatedRoute, private sessionsService: SessionsService, private siteNamePipe: SiteNamePipe) { }

  formatTotalTime(sessions: any[]) {
    // Sum all the timeonwater values from the sessions
    const totalSeconds = sessions.reduce((total, session) => total + session.timeonwater, 0);

    // Convert total seconds into hours and minutes
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    // Return the formatted string "H:MM"
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }

  ngOnInit() {
    Chart.register(Filler);

    this.sessionsService.data$.subscribe((data) => {
      if (!data) {
        this.siteCount = 0
        this.kiterCount = 0
        this.totalTime = '0'
        this.totalJumps = 0
        return
      }
      this.sessions = data;
      // console.log('Received data:', data[0].jumps.length);

      const uniqueSpotIds = new Set();
      this.sessions.forEach(session => {
        uniqueSpotIds.add(session.spot.id);
      });
      this.siteCount = uniqueSpotIds.size;

      const uniqueKiters = new Set();
      this.sessions.forEach(session => {
        uniqueKiters.add(session.user.id);
      });
      this.kiterCount = uniqueKiters.size;

      this.totalTime = this.formatTotalTime(this.sessions) + 'h'

      this.totalJumps = this.sessions.reduce((total, session) => total + (session.jumps?.length ? session.jumps.length : 0), 0);

      if (this.sessions.length > 0) {
        this.processSessions()
      } else {
        this.chartData = {
          datasets: []
        }
        // console.log('in here')
      }


    });



    this.state$ = this.activatedRoute.paramMap
      .pipe(map(() => {

        console.log('pip is working', window.history.state)
        return window.history.state

      }))

  }

  public chartData: any;
  public chartOptions: any;

  processSessions() {
    // Time zone identifier for PST/PDT
    const timeZone = 'America/Los_Angeles';

    // **Set the bin size in minutes**
    const binSize = 10; // You can adjust this value as needed

    // Define chart start and end times (9:00 AM to 9:00 PM PST)
    const dayStartDate = toZonedTime(this.sessions[0].startepoch, timeZone);
    dayStartDate.setHours(9, 0, 0, 0);
    const dayStartTime = dayStartDate.getTime();

    const dayEndDate = new Date(dayStartDate);
    dayEndDate.setHours(21, 0, 0, 0);
    const dayEndTime = dayEndDate.getTime();

    // Total chart duration in minutes
    const totalDuration = (dayEndTime - dayStartTime) / (1000 * 60);

    // **Calculate the number of intervals based on the bin size**
    const intervalCount = Math.ceil(totalDuration / binSize);

    // **Create the bins based on the bin size**
    const binEdges: number[] = [];
    for (let i = 0; i <= intervalCount; i++) {
      binEdges.push(i * binSize); // Minutes since 9:00 AM
    }

    // Get a list of unique site IDs
    const siteIds = Array.from(new Set(this.sessions.map(session => session.spot.id)));

    // Prepare datasets array
    const datasets: any[] = [];

    // Assign colors to each site for visualization
    const colors = [
      'rgba(75,192,192,0.4)',   // Teal
      'rgba(192,75,192,0.4)',   // Purple
      'rgba(192,192,75,0.4)',   // Olive
      'rgba(75,75,192,0.4)',    // Blue
      'rgba(192,75,75,0.4)',    // Red
      // Add more colors as needed
    ];

    // Process sessions for each site
    siteIds.forEach((siteId, index) => {
      const siteSessions = this.sessions.filter(session => session.spot.id === siteId);

      // Initialize counts for each bin
      const binCounts = Array(binEdges.length - 1).fill(0);

      // For each session, determine which bins it overlaps
      siteSessions.forEach(session => {
        // Convert start time to PST time zone
        const startDate = toZonedTime(session.startepoch, timeZone);
        const startTime = startDate.getTime();
        const endTime = startTime + session.timeonwater * 1000;

        // Calculate minutes since 9:00 AM
        const startMinutes = (startTime - dayStartTime) / (1000 * 60);
        const endMinutes = (endTime - dayStartTime) / (1000 * 60);

        // Determine which bins the session is active in
        for (let i = 0; i < binEdges.length - 1; i++) {
          const binStart = binEdges[i];
          const binEnd = binEdges[i + 1];

          // Check if the session overlaps with this bin
          if (startMinutes < binEnd && endMinutes > binStart) {
            binCounts[i] += 1;
          }
        }
      });

      // Create data points based on bin counts
      const dataPoints: { x: number; y: number }[] = [];

      // Starting point at 9:00 AM
      dataPoints.push({ x: 0, y: 0 });

      for (let i = 0; i < binCounts.length; i++) {
        const binStart = binEdges[i];

        // Add data point at the start of the bin
        dataPoints.push({ x: binStart, y: binCounts[i] });

        // The value remains constant until the next bin
        if (i < binCounts.length - 1) {
          dataPoints.push({ x: binEdges[i + 1], y: binCounts[i] });
        }
      }

      // Ensure the chart ends at the last bin edge
      dataPoints.push({ x: totalDuration, y: 0 });

      // Add dataset for this site
      datasets.push({
        data: dataPoints,
        label: `Site ${siteId}`,
        fill: 'origin',
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length].replace('0.4', '1'),
        stepped: false,
        borderWidth: 1,
        tension: .04,
      });
    });

    // Set up chart data with multiple datasets
    this.chartData = {
      datasets: datasets
    };

    // Set up chart options with a linear x-axis
    this.chartOptions = {
      elements: {
        point: {
          radius: 0
        }
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          min: 0,
          max: totalDuration,
          title: {
            display: true,
            text: 'Time (PST)'
          },
          ticks: {
            stepSize: 60, // **Use the bin size for stepSize**
            callback: (value: any) => {
              // Convert minutes to time labels (e.g., 9:30 AM)
              const minutes = Number(value);
              const hours = Math.floor(minutes / 60) + 9; // 9 is the start hour
              const mins = Math.floor(minutes % 60);
              const ampm = hours >= 12 ? 'PM' : 'AM';
              const displayHour = hours > 12 ? hours - 12 : hours;
              return `${displayHour} ${ampm}`;
            }
          }
        },
        y: {
          suggestedMax: 10,
          beginAtZero: true,
          title: {
            display: true,
            text: '# of Sessions'
          },
          ticks: {
            stepSize: 1,

          }
        }
      },
      plugins: {
        title: {
          display: false,
          text: `Surf Sessions Throughout the Day by Site (${binSize}-Minute Intervals)`
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            title: (tooltipItems: any) => {
              // Convert minutes back to time for the tooltip
              const minutes = tooltipItems[0].parsed.x;
              const hours = Math.floor(minutes / 60) + 9; // 9 is the start hour
              const mins = Math.floor(minutes % 60);
              const ampm = hours >= 12 ? 'PM' : 'AM';
              const displayHour = hours > 12 ? hours - 12 : hours;
              return `${displayHour}:${mins.toString().padStart(2, '0')} ${ampm}`;
            }
          }
        },
        legend: {
          display: false
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }

}
