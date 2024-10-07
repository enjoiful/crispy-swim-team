import { Routes, RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardCardComponent} from './dashboard-card/dashboard-card.component'
import { AppComponent} from './app.component'
import { HomeComponent} from './home/home.component'
import { SiteRecapComponent} from './site-recap/site-recap.component'
import { LeaderboardComponent} from './leaderboard/leaderboard.component'
import { ChallengesComponent} from './challenges/challenges.component'
import { KitersComponent} from './kiters/kiters.component'
import { KiterDetailsComponent} from './kiter-details/kiter-details.component'
import { SessionsComponent} from './sessions/sessions.component'


import { SiteDetailsComponent} from './site-details/site-details.component'
import { AllSitesComponent} from './all-sites/all-sites.component'

export const routes: Routes = [
    // {path: 'home', component: HomeComponent},
    { path: 'old', component: AppComponent },
    { path: 'site-recap', component: SiteRecapComponent },
    { path: 'leaderboard', component: LeaderboardComponent },
    { path: 'challenges', component: ChallengesComponent },
    { path: 'sessions', component: SessionsComponent },
    { path: 'component1/', component: DashboardCardComponent },
    { path: 'all-sites/', component: AllSitesComponent },
    { path: 'site-details/', component: SiteDetailsComponent },
    // { path: '', redirectTo: '/site-recap/0', pathMatch: 'full' }, // Default route
    // { path: '**', redirectTo: '/component1' } // Wildcard route


    { path: 'kiters', component: KitersComponent },
    { path: 'kiters/:kiterId', component: KiterDetailsComponent },
  ];
  
