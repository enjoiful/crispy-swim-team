import { bootstrapApplication } from '@angular/platform-browser';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

  bootstrapApplication(AppComponent, {
    providers: [
      provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
      provideDatabase(() => getDatabase()), provideCharts(withDefaultRegisterables()),
    ],
  }).catch((err) => console.error(err));