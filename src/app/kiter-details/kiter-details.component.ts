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
import { SitesChartComponent } from '../sites-chart/sites-chart.component'
import { Chart } from 'chart.js';
import { mergeMap, concatMap } from 'rxjs/operators';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd, NavigationError, Event } from '@angular/router';
@Component({
  selector: 'app-kiter-details',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, SitesChartComponent, RouterOutlet, CommonModule, FormsModule, BaseChartDirective, RouterLink, SiteNamePipe, SessionCardComponent],
  templateUrl: './kiter-details.component.html',
  styleUrl: './kiter-details.component.css'
})
export class KiterDetailsComponent {
  sessions: any
  constructor(private firebaseService: FirebaseService, private siteNamePipe: SiteNamePipe, private sessionsService: SessionsService, private route: ActivatedRoute, private router: Router) {
  }
  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      console.log('params are, params', params['kiterId'])
      // Call the getSessionsForUser method from FirebaseService and subscribe to its observable
      this.firebaseService.getSessionsForUser(Number(params['kiterId'])).subscribe({
        next: (sessions) => {
          console.log('User Sessions:', sessions);
          this.sessionsService.updateData(sessions);
          this.sessions = sessions
        },
        error: (error) => {
          console.error(error);  
        }
      });
    })
  }
}