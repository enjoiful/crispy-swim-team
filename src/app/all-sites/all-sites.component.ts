import 'chartjs-adapter-date-fns';
import { Component, Input, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, map } from 'rxjs'
import { DashboardCardComponent } from "../dashboard-card/dashboard-card.component";
import { SessionsService } from '../sessions.service'
import { ChartData, ChartOptions, Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { toZonedTime } from 'date-fns-tz';
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
  constructor(public activatedRoute: ActivatedRoute, private sessionsService: SessionsService) { }

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
        this.processSessions(this.sessions)

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

processSessions(sessions: any[]) {
  // Time zone identifier for PST/PDT
  const timeZone = 'America/Los_Angeles';

  // Define chart start and end times (9:00 AM to 9:00 PM PST)
  const dayStartDate = toZonedTime(sessions[0].startepoch, timeZone);
  dayStartDate.setHours(9, 0, 0, 0);
  const dayStartTime = dayStartDate.getTime();

  const dayEndDate = new Date(dayStartDate);
  dayEndDate.setHours(21, 0, 0, 0);
  const dayEndTime = dayEndDate.getTime();

  // Get a list of unique site IDs
  const siteIds = Array.from(new Set(sessions.map((session: any) => session.spot.id)));

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

    // Create events for session starts and ends
    let events: { time: number; change: number }[] = [];

    siteSessions.forEach(session => {
      // Convert start time to PST time zone
      const startDate = toZonedTime(session.startepoch, timeZone);
      const startTime = startDate.getTime();
      const endTime = startTime + session.timeonwater * 1000;

      events.push({ time: startTime, change: 1 });   // Session starts
      events.push({ time: endTime, change: -1 });    // Session ends
    });

    // Sort events by time
    events.sort((a, b) => a.time - b.time);

    // Initialize data points for this site
    let dataPoints: { x: number; y: number }[] = [];

    // Initialize session count
    let currentSessions = 0;
    dataPoints.push({ x: dayStartTime, y: currentSessions });

    // Process events to calculate the number of active sessions over time
    events.forEach(event => {
      if (event.time >= dayStartTime && event.time <= dayEndTime) {
        currentSessions += event.change;
        dataPoints.push({ x: event.time, y: currentSessions });
      }
    });

    dataPoints.push({ x: dayEndTime, y: currentSessions });

    // Add dataset for this site
    datasets.push({
      data: dataPoints,
      label: `Site ${siteId}`,
      fill: 'origin',
      backgroundColor: colors[index % colors.length],
      borderColor: colors[index % colors.length].replace('0.4', '1'),
      // stepped: true,
      tension: 0.2,
        borderWidth: 1, // Increase the border width

    });
  });

  datasets.forEach((ds: any) => {
    if (ds.data && ds.data && ds.data.length > 2){
      let starter = {x:ds.data[1].x, y: ds.data[1].y }
      starter.x = starter.x - 2000000 //bump back 1s
      starter.y = 0
      console.log('starter is', starter)
      ds.data.splice(1, 0, starter)
    }
  })

  // Set up chart data with multiple datasets
  this.chartData = {
    datasets: datasets
  };

  console.log('chart data', this.chartData)

  // Set up chart options (enable legend)
  this.chartOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          displayFormats: {
            hour: 'h a'
          },
          tooltipFormat: 'h:mm a',
        },
        min: dayStartTime,
        max: dayEndTime,
        title: {
          display: true,
          text: 'Time (PST)'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '# of Sessions'
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Surf Sessions Throughout the Day by Site'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      },
      legend: {
        display: true
      }
    },
                options: {
                elements: {
                    point:{
                        radius: 0
                    }
                }
            },
    responsive: true,
    maintainAspectRatio: false
  };
}


}
