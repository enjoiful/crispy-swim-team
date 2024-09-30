import { Component, Input,} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, map } from 'rxjs'
import { DashboardCardComponent } from "../dashboard-card/dashboard-card.component";
import { SessionsService} from '../sessions.service'


@Component({
  selector: 'app-site-details',
  standalone: true,
  imports: [DashboardCardComponent],
  templateUrl: './site-details.component.html',
  styleUrl: './site-details.component.css'
})
export class SiteDetailsComponent {
  sessions: any[] = []
  siteCount: number = 0;
  kiterCount: number = 0;
  totalTime: string = ''
  totalJumps: number = 0;
  state$: Observable<object>
  constructor(public activatedRoute: ActivatedRoute, private sessionsService: SessionsService) {}

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
    this.sessionsService.data$.subscribe((data) => {
      if (!data){
        this.siteCount = 0
        this.kiterCount = 0
        this.totalTime ='0'
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


    });

    

    this.state$ = this.activatedRoute.paramMap
      .pipe(map(() => {

        console.log('pip is working', window.history.state)
        return window.history.state

      } ))
      
  }

}