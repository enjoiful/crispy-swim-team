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
  selector: 'app-kiters',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, SitesChartComponent, RouterOutlet, CommonModule, FormsModule, BaseChartDirective, RouterLink, SiteNamePipe, SessionCardComponent],
  templateUrl: './kiters.component.html',
  styleUrl: './kiters.component.css',
  providers: [FirebaseService, SessionsService], // Ensure your service is properly injected
})
export class KitersComponent {
  sessions: any
  kiters: any[]
  constructor(private firebaseService: FirebaseService, private siteNamePipe: SiteNamePipe, private sessionsService: SessionsService, private route: ActivatedRoute, private router: Router) {
  }
  ngOnInit() {

    let start2024 = 1704129780
    let end2024 =
    this.firebaseService.getSessionsBetweenEpochs(1704129780, 1735665780000, true).subscribe((apiData: any) => {
        console.log('All sessions:', apiData);
        this.sessions = apiData
        this.kiters = this.getUniqueSurfers(apiData)
        console.log('kiters', this.kiters)
     
    });
     
  }


private getUniqueSurfers(sessions: any) {
  const surfersMap = new Map();

  sessions.forEach((session: any) => {
    const surfer = session.user;
    if (!surfersMap.has(surfer.id)) {
      surfersMap.set(surfer.id, surfer);
    }
  });

  // Convert the map values to an array of unique surfers
  return Array.from(surfersMap.values()).sort((a, b) => a.name.localeCompare(b.name));;
}



}