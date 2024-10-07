import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs'
import { SessionsService } from '../sessions.service'


import { initializeApp } from 'firebase/app';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { FormsModule } from '@angular/forms';  // <-- Import FormsModule
import { environment } from '../../environments/environment';
import { BaseChartDirective } from 'ng2-charts';
import { SiteNamePipe } from '../site-name.pipe'; // Adjust the path as needed
import { SessionCardComponent } from '../session-card/session-card.component'
import { AllSitesComponent } from '../all-sites/all-sites.component'
import { mergeMap, concatMap } from 'rxjs/operators';
import { Chart } from 'chart.js';
import 'chartjs-plugin-datalabels'; // Import the plugin
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-sites-chart',
  standalone: true,
  imports: [SiteNamePipe, SiteNamePipe, BaseChartDirective, AllSitesComponent],
  templateUrl: './sites-chart.component.html',
  styleUrl: './sites-chart.component.css'
})
export class SitesChartComponent {
  myObservable$: Observable<string>;
  chartOptions: any
  barChartData: any

  constructor(private firebaseService: FirebaseService, private siteNamePipe: SiteNamePipe, private sessionsService: SessionsService,) {
    initializeApp(environment.firebaseConfig);
  }


  @Input() sessions: string[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sessions']) {
      console.log('Items changed:', changes['sessions'].currentValue);
      this.createChart(changes['sessions'].currentValue)
    }
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

}