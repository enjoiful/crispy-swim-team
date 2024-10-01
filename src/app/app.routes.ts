import { Routes, RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardCardComponent} from './dashboard-card/dashboard-card.component'

import { SiteDetailsComponent} from './site-details/site-details.component'
import { AllSitesComponent} from './all-sites/all-sites.component'

export const routes: Routes = [
    { path: 'component1', component: DashboardCardComponent },
    { path: 'all-sites', component: AllSitesComponent },
    { path: 'site-details', component: SiteDetailsComponent },
    { path: '', redirectTo: '/all-sites', pathMatch: 'full' }, // Default route
    // { path: '**', redirectTo: '/component1' } // Wildcard route
  ];
  
